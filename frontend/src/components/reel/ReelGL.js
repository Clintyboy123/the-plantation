// ReelGL: the WebGL layer of the wedding "experience" reel (after siena.film).
// Draws each card (photo + rounded corners + gold frame) as a finely subdivided plane, so it can be
// warped like film over a drum:
//   - drum: every vertex is projected onto a horizontal cylinder through the screen centre; cards
//     curve away and narrow towards the top and bottom of the screen (flat in the centre)
//   - bow: while the reel moves, the middle of each card lags behind its edges (velocity bend),
//     so its horizontal edges curve; at rest the bow is zero
//   - inside the card the photo is cover-fitted, slightly zoomed, and drifts against the card's
//     travel (parallax), then is graded (darker at the sides for the text) and dimmed off-centre
// No library: plain WebGL1 so it runs everywhere WebGL does.

const VERT = `
attribute vec2 aUv;
uniform vec2 uRes;      // canvas size in CSS px
uniform vec4 uRect;     // card centre x, centre y, width, height (CSS px, y down)
uniform float uBow;     // velocity bend amplitude in px
uniform float uDrum;    // drum radius in px
varying vec2 vUv;
varying float vShade;
void main() {
  vUv = aUv;
  vec2 p = vec2(uRect.x + (aUv.x - 0.5) * uRect.z, uRect.y + (aUv.y - 0.5) * uRect.w);
  // bow: the middle of the card trails its edges while it travels
  p.y += uBow * sin(3.14159265 * aUv.x);
  // drum projection
  float cy = uRes.y * 0.5;
  float th = clamp((p.y - cy) / uDrum, -1.45, 1.45);
  float y = cy + uDrum * sin(th);
  float k = 1.0 - (1.0 - cos(th)) * 0.22; // gentle: flat at the centre, narrowing towards top and bottom
  float x = uRes.x * 0.5 + (p.x - uRes.x * 0.5) * k;
  vShade = 1.0 - cos(th);
  gl_Position = vec4(x / uRes.x * 2.0 - 1.0, 1.0 - y / uRes.y * 2.0, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uHasTex;
uniform vec2 uSize;       // card size in CSS px
uniform float uImgAspect; // photo width / height
uniform float uOff;       // offset from centre, in cards
uniform float uDim;       // 0..1 darken off-centre cards
uniform vec3 uBg;         // fill before the photo loads
uniform vec2 uFocus;      // photo focal point (0..1)
varying vec2 vUv;
varying float vShade;

float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
// the site's --gradient-gold, as a ramp
vec3 gold(float t) {
  vec3 c0 = vec3(0.659, 0.518, 0.298); // #a8844c
  vec3 c1 = vec3(0.847, 0.780, 0.667); // #d8c7aa
  vec3 c2 = vec3(0.953, 0.906, 0.784); // #f3e7c8
  vec3 c3 = vec3(0.788, 0.651, 0.420); // #c9a66b
  vec3 c4 = vec3(0.910, 0.843, 0.682); // #e8d7ae
  vec3 c5 = vec3(0.722, 0.580, 0.353); // #b8945a
  t = fract(t);
  if (t < 0.22) return mix(c0, c1, t / 0.22);
  if (t < 0.38) return mix(c1, c2, (t - 0.22) / 0.16);
  if (t < 0.52) return mix(c2, c3, (t - 0.38) / 0.14);
  if (t < 0.68) return mix(c3, c4, (t - 0.52) / 0.16);
  if (t < 0.84) return mix(c4, c5, (t - 0.68) / 0.16);
  return mix(c5, c1, (t - 0.84) / 0.16);
}
void main() {
  vec2 half_ = uSize * 0.5;
  vec2 px = (vUv - 0.5) * uSize;
  float R = 18.0, BAND = 4.0, GAP = 5.0; // keep in step with .frame in index.css
  float dOut = sdRound(px, half_, R);
  float dIn = sdRound(px, half_ - (BAND + GAP), R - BAND - GAP);
  float aOut = 1.0 - smoothstep(-0.75, 0.75, dOut);
  float aRing = aOut * smoothstep(-0.75, 0.75, dOut + BAND);
  float aPhoto = 1.0 - smoothstep(-0.75, 0.75, dIn);

  // photo: cover-fit, zoom, focal point, parallax drift against the card's travel
  float cardAspect = uSize.x / uSize.y;
  // h = half the visible window of the photo, in photo UV units
  float zoom = 1.14 + min(abs(uOff), 1.5) * 0.06;
  vec2 h = vec2(0.5) / zoom;
  if (uImgAspect > cardAspect) h.x *= cardAspect / uImgAspect; else h.y *= uImgAspect / cardAspect;
  vec2 slack = 0.5 - h;                                   // how far the window can move without leaving the photo
  vec2 centre = vec2(0.5) + (uFocus - 0.5) * 2.0 * slack; // art-directed focal point
  centre.y += clamp(uOff, -1.5, 1.5) * min(0.085, slack.y * 0.6); // parallax drift
  centre = clamp(centre, h, 1.0 - h);
  vec2 uv = centre + (vUv - 0.5) * 2.0 * h;
  vec3 img = uHasTex > 0.5 ? texture2D(uTex, clamp(uv, 0.001, 0.999)).rgb : uBg;

  // grading: darker at both sides (title block left, notes right) and towards the bottom
  vec3 grade = vec3(0.094, 0.133, 0.110);
  float x = vUv.x;
  // left: title block; right (from the column rule at ~67%): notes column, kept dark enough for small text
  float side = x < 0.38 ? mix(0.82, 0.25, x / 0.38)
             : x < 0.6 ? mix(0.25, 0.2, (x - 0.38) / 0.22)
             : x < 0.7 ? mix(0.2, 0.7, (x - 0.6) / 0.1)
             : mix(0.7, 0.84, (x - 0.7) / 0.3);
  img = mix(img, grade, side);
  img = mix(img, vec3(0.125, 0.176, 0.145), smoothstep(0.5, 1.0, vUv.y) * 0.7);
  img = mix(img, grade, (1.0 - smoothstep(0.0, 0.22, vUv.y)) * 0.35); // top edge, for the eyebrow and counter
  img = mix(img, vec3(0.125, 0.176, 0.145), uDim);
  img *= 1.0 - vShade * 0.55;

  vec3 ring = gold(vUv.x * 0.9 + vUv.y * 0.15 + 0.05) * (1.0 - vShade * 0.35);
  float a = max(aPhoto, aRing);
  vec3 col = aRing > 0.001 ? mix(img, ring, aRing / max(a, 0.0001)) : img;
  if (a < 0.002) discard;
  gl_FragColor = vec4(col * a, a); // premultiplied
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export default class ReelGL {
  constructor(canvas) {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    this.canvas = canvas;
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    this.prog = prog;
    gl.useProgram(prog);

    // a 48 x 24 grid: enough subdivision for a smooth curve
    const SX = 48, SY = 24;
    const uvs = [];
    for (let j = 0; j < SY; j++) {
      for (let i = 0; i < SX; i++) {
        const u0 = i / SX, u1 = (i + 1) / SX, v0 = j / SY, v1 = (j + 1) / SY;
        uvs.push(u0, v0, u1, v0, u0, v1, u0, v1, u1, v0, u1, v1);
      }
    }
    this.count = uvs.length / 2;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aUv');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.u = {};
    for (const n of ['uRes', 'uRect', 'uBow', 'uDrum', 'uTex', 'uHasTex', 'uSize', 'uImgAspect', 'uOff', 'uDim', 'uBg', 'uFocus']) {
      this.u[n] = gl.getUniformLocation(prog, n);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.textures = [];
  }

  // cards: [{ src, aspect, focus: [x, y] }]
  load(cards) {
    const gl = this.gl;
    this.textures = cards.map((c) => {
      const entry = { tex: gl.createTexture(), ready: false, aspect: c.aspect, focus: c.focus };
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, entry.tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        entry.ready = true;
        this.dirty = true;
      };
      img.src = c.src;
      return entry;
    });
  }

  resize(w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  // state: { cards: [{ cx, cy, w, h, off, dim }], bow, drum }
  render(state) {
    const { gl, u } = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, this.w, this.h);
    gl.uniform1f(u.uDrum, state.drum);
    gl.uniform3f(u.uBg, 0.125, 0.176, 0.145);
    // far cards first so the centred card is drawn last
    const order = state.cards.map((c, i) => i).sort((a, b) => Math.abs(state.cards[b].off) - Math.abs(state.cards[a].off));
    for (const i of order) {
      const c = state.cards[i];
      if (Math.abs(c.off) > 2.3) continue;
      const t = this.textures[i];
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, t?.tex || null);
      gl.uniform1i(u.uTex, 0);
      gl.uniform1f(u.uHasTex, t?.ready ? 1 : 0);
      gl.uniform1f(u.uImgAspect, t?.aspect || 1.5);
      gl.uniform2f(u.uFocus, t?.focus?.[0] ?? 0.5, t?.focus?.[1] ?? 0.5);
      gl.uniform4f(u.uRect, c.cx, c.cy, c.w, c.h);
      gl.uniform2f(u.uSize, c.w, c.h);
      gl.uniform1f(u.uOff, c.off);
      gl.uniform1f(u.uDim, c.dim);
      gl.uniform1f(u.uBow, state.bow);
      gl.drawArrays(gl.TRIANGLES, 0, this.count);
    }
  }

  // Free GPU memory but keep the context alive: React may mount the same canvas again
  // (development double-mount), and a deliberately lost context cannot be reused.
  destroy() {
    const { gl } = this;
    this.textures.forEach((t) => gl.deleteTexture(t.tex));
    this.textures = [];
    gl.deleteProgram(this.prog);
  }
}
