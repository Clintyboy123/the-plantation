import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { easyEaseFn } from '../../utils/motion';

// The engagement ring, lit only by the "Pretoria Gardens" HDRI (image-based lighting: no lamps), rendered on
// demand: a frame is drawn only when the pose changes (scroll) or the canvas resizes, never in a loop.
//
// Model: public/ring/solitaire-ring.glb (Draco-compressed; decoder self-hosted in public/ring/draco/).
// In the file the ring stands upright, facing the camera, stone on top. That is the end pose; the scroll
// takes it from a turned and tilted start to front-facing, tipped towards the viewer.
//
//   setPose(t)        t 0..1: 0 = small, turned away (Y) and tilted (Z); 1 = front-facing, stone towards you, full size
//   rotateBy(dx, dy)  the visitor's own turn (drag), on top of the scroll pose
//   settle()          eases the visitor's turn back to the scroll pose (Easy Ease)

const START = { x: 0.16, y: -1.15, z: 0.62 }; // radians: turned away and tilted
// End: front-facing, with the top of the ring tipped towards the viewer (like looking down at a ring on a
// display) so the stone's table faces you and the band reads as a soft ellipse.
const END = { x: 1.0, y: 0, z: 0 };
const SCALE = { from: 0.6, to: 1.12 }; // starts small, zooms in as you scroll
const IVORY = '#f6f3ec'; // the page background behind it

export default class RingRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3; // a mild lift: the garden HDRI is darker than the sunset one
    // opaque, in exactly the page's ivory: the diamond refracts what is behind it, and that should be the page
    this.renderer.setClearColor(new THREE.Color(IVORY), 1);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(IVORY);
    this.camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9.5);

    // user (drag) rotation wraps the scroll pose, so the two never fight
    this.user = new THREE.Group();
    this.scene.add(this.user);
    this.pivot = new THREE.Group();
    this.user.add(this.pivot);
    this.t = 0;
    this.ready = false;
  }

  async load({ model, hdr, draco }) {
    const draco_ = new DRACOLoader().setDecoderPath(draco);
    const gltfLoader = new GLTFLoader().setDRACOLoader(draco_);
    const [hdrTex, gltf] = await Promise.all([new HDRLoader().loadAsync(hdr), gltfLoader.loadAsync(model)]);
    draco_.dispose();
    if (this.disposed) return;

    // HDRI -> prefiltered environment for reflections and refraction
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    hdrTex.mapping = THREE.EquirectangularReflectionMapping;
    this.env = pmrem.fromEquirectangular(hdrTex).texture;
    hdrTex.dispose();
    pmrem.dispose();
    this.scene.environment = this.env;
    this.scene.environmentRotation.set(0, Math.PI * 0.62, 0); // turns the garden so its brightest light rims the band

    // Materials: the band keeps its supplied platinum colour; the stone becomes a diamond.
    const metal = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.54, 0.54, 0.546), // from the model ('Metal 01', linear)
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.35,
    });
    // A clear (transmissive) stone vanishes against a plain ivory page, so the diamond is drawn the way it
    // reads in photographs: hard bright facets with a touch of iridescent fire.
    const diamond = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.45,
      roughness: 0,
      flatShading: true,
      ior: 2.42, // diamond: strong facet reflections
      specularIntensity: 1,
      // the same HDRI, turned upside down for the stone only: in a real diamond light enters the top
      // and bounces back out of the pavilion, so the lower facets glow with sky rather than mirroring the ground
      envMap: this.env,
      envMapIntensity: 3.4,
      clearcoat: 1,
      clearcoatRoughness: 0,
      iridescence: 0.5,
      iridescenceIOR: 2.0,
      iridescenceThicknessRange: [180, 620],
    });
    diamond.envMapRotation.set(Math.PI, 0, 0);
    this.materials = [metal, diamond];

    const root = gltf.scene;
    root.traverse((o) => {
      if (!o.isMesh) return;
      const old = o.material;
      o.material = old?.name === 'Metal 01' ? metal : diamond;
      old?.dispose?.();
    });

    // centre on the origin and normalise the size (3 units tall)
    const box = new THREE.Box3().setFromObject(root);
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const inner = new THREE.Group();
    root.position.sub(centre);
    inner.add(root);
    inner.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
    this.pivot.add(inner);
    this.model = root;

    this.ready = true;
    this.setPose(this.t);
  }

  setPose(t) {
    this.t = t;
    if (!this.ready) return;
    const e = easyEaseFn(Math.min(1, Math.max(0, t)));
    this.pivot.rotation.set(
      START.x + (END.x - START.x) * e,
      START.y + (END.y - START.y) * e,
      START.z + (END.z - START.z) * e,
    );
    this.pivot.scale.setScalar(SCALE.from + (SCALE.to - SCALE.from) * e);
    this.render();
  }

  rotateBy(dx, dy) {
    cancelAnimationFrame(this.settleRaf);
    const k = 0.008; // radians per pixel
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * k);
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * k);
    this.user.quaternion.premultiply(qy).premultiply(qx);
    this.render();
  }

  settle(duration = 1.1) {
    cancelAnimationFrame(this.settleRaf);
    const from = this.user.quaternion.clone();
    if (from.angleTo(new THREE.Quaternion()) < 0.001) return;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / (duration * 1000));
      this.user.quaternion.slerpQuaternions(from, new THREE.Quaternion(), easyEaseFn(k));
      this.render();
      if (k < 1) this.settleRaf = requestAnimationFrame(step);
    };
    this.settleRaf = requestAnimationFrame(step);
  }

  resize(width, height) {
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // keep the ring the same size on narrow (portrait) boxes: pull the camera back instead of cropping
    this.camera.position.z = width < height ? 9.5 * (height / width) * 0.82 : 9.5;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render() {
    if (!this.ready || this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.settleRaf);
    this.model?.traverse((o) => o.geometry?.dispose());
    this.materials?.forEach((m) => m.dispose());
    this.env?.dispose();
    this.renderer.dispose();
  }
}
