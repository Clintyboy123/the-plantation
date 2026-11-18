import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Music, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { ease, easyEaseFn } from '../utils/motion';

// Site-wide music, bottom-left. One <audio> element lives in the layout, so playback carries on
// across every page. Starts by itself when the logo intro ends (or on the first interaction, if the
// browser blocks sound until then). Fades in and out (Easy Ease), plays the
// three tracks in turn, and remembers the visitor's volume on this device. It starts on every visit.
//
// Tracks are licensed stock music (AudioJungle / MoodMode, Alex Shulgin): keep the licences on file for
// this website before launch.
const TRACKS = [
  { src: '/music/cinematic-ambient-inspire.m4a', title: 'Cinematic Ambient Inspire', artist: 'Alex Shulgin' },
  { src: '/music/uplifting-piano.m4a', title: 'Uplifting Piano', artist: 'MoodMode' },
  { src: '/music/wedding-full-track.m4a', title: 'Wedding', artist: 'Full track' },
];
const FADE = 900; // ms

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(`plantation-music-${key}`);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`plantation-music-${key}`, JSON.stringify(value));
    } catch {
      /* private mode: fine, just not remembered */
    }
  },
};


export default function MusicPlayer() {
  const reduce = useReducedMotion();
  const audio = useRef(null);
  const fadeRaf = useRef(0);
  const closeTimer = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [volume, setVolume] = useState(() => store.get('volume', 0.5));
  const [muted, setMuted] = useState(false); // every visit starts with sound on
  const [open, setOpen] = useState(false);
  const [needsTap, setNeedsTap] = useState(false); // the browser blocked autoplay: invite one tap

  const target = muted ? 0 : volume;

  const fadeTo = useCallback((to, then) => {
    const a = audio.current;
    if (!a) return;
    cancelAnimationFrame(fadeRaf.current);
    const from = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / FADE);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * easyEaseFn(k)));
      if (k < 1) fadeRaf.current = requestAnimationFrame(step);
      else then?.();
    };
    fadeRaf.current = requestAnimationFrame(step);
  }, []);

  // Resolves true if the browser let it play, false if it was blocked (no interaction yet).
  const play = useCallback(() => {
    const a = audio.current;
    if (!a) return Promise.resolve(false);
    a.volume = 0;
    setPlaying(true);
    const p = a.play();
    return Promise.resolve(p)
      .then(() => {
        fadeTo(target);
        return true;
      })
      .catch(() => {
        setPlaying(false);
        return false;
      });
  }, [fadeTo, target]);

  const pause = useCallback(() => {
    setPlaying(false);
    fadeTo(0, () => audio.current?.pause());
  }, [fadeTo]);

  const toggle = () => {
    setNeedsTap(false);
    if (playing) {
      pause();
    } else {
      play();
    }
    peek();
  };

  // Starts on every visit, as the logo intro fades into the page (LogoIntro fires 'plantation:enter').
  // Browsers only allow sound once the visitor has interacted with the page (a click, tap or key; scrolling
  // does not count). So: any interaction during the intro quietly unlocks the audio, and the music starts the
  // moment the intro ends; if nothing unlocked it yet, it starts on the visitor's first click, tap or key.
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    const a = audio.current;
    let introDone = false;
    let started = false;
    const gestures = ['pointerdown', 'keydown', 'touchend', 'click'];
    const start = () =>
      playRef.current().then((ok) => {
        if (ok) {
          started = true;
          setNeedsTap(false);
          disarm();
        } else if (introDone) {
          setNeedsTap(true);
        }
        return ok;
      });
    const onGesture = (e) => {
      // the player's own buttons handle themselves; a click on the intro skips it, which starts the music itself
      if (started || e.target?.closest?.('[data-music-player], [data-logo-intro]')) return;
      if (introDone) {
        if (a.paused) start();
        return;
      }
      // still in the intro: play silently for an instant inside the gesture, which unlocks sound for later
      if (!a.src) a.src = TRACKS[0].src;
      a.volume = 0;
      Promise.resolve(a.play())
        .then(() => {
          if (!introDone) a.pause();
        })
        .catch(() => {});
    };
    const arm = () => gestures.forEach((g) => window.addEventListener(g, onGesture, { capture: true }));
    const disarm = () => gestures.forEach((g) => window.removeEventListener(g, onGesture, { capture: true }));
    let starting = false;
    const onIntroDone = () => {
      introDone = true;
      if (started || starting) return;
      starting = true;
      start().finally(() => {
        starting = false;
      });
    };
    arm();
    // 'plantation:enter' fires as the intro starts to fade (inside the click, if the visitor skipped);
    // 'plantation:intro-done' is a second chance once it has gone. If the browser still blocks sound,
    // the gesture listeners above start it on the first click, tap or key.
    window.addEventListener('plantation:enter', onIntroDone);
    window.addEventListener('plantation:intro-done', onIntroDone);
    return () => {
      window.removeEventListener('plantation:enter', onIntroDone);
      window.removeEventListener('plantation:intro-done', onIntroDone);
      disarm();
    };
  }, []);

  const next = () => {
    setTrack((t) => (t + 1) % TRACKS.length);
    peek();
  };

  // load the next track and keep playing if we were
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.src = TRACKS[track].src;
    if (playing) {
      a.volume = 0;
      a.play().then(() => fadeTo(target)).catch(() => setPlaying(false));
    }
  }, [track]); // eslint-disable-line react-hooks/exhaustive-deps

  // live volume / mute changes
  useEffect(() => {
    store.set('volume', volume);
    if (playing && audio.current) {
      cancelAnimationFrame(fadeRaf.current);
      audio.current.volume = target;
    }
  }, [volume, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  // On touch screens there is no hover: show the controls for a few seconds after a tap.
  const peek = () => {
    setOpen(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 4500);
  };

  const t = TRACKS[track];

  return (
    <div
      data-music-player
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[var(--margin)] z-40"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <audio ref={audio} preload="none" onEnded={next} />
      <div className="flex items-center rounded-full bg-ivory/95 p-1 text-evergreen shadow-[0_14px_36px_-20px_rgb(32_45_37/0.55)] ring-1 ring-champagne backdrop-blur-md">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-ivory transition-colors duration-500 hover:bg-evergreen"
        >
          {playing ? <Pause className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> : <Music className="size-4" strokeWidth={1.6} aria-hidden="true" />}
          {/* soft pulse while music plays */}
          {(playing || needsTap) && !reduce && (
            <span aria-hidden="true" className="absolute inset-0 rounded-full ring-2 ring-champagne/70" style={{ animation: 'music-pulse 2.4s var(--ease-site) infinite' }} />
          )}
        </button>

        {/* Shown only when the browser held the sound back: one tap anywhere starts it */}
        <AnimatePresence initial={false}>
          {needsTap && !open && (
            <motion.button
              key="hint"
              type="button"
              onClick={toggle}
              className="overflow-hidden whitespace-nowrap pl-3 pr-4 type-label text-evergreen"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1, transition: { duration: 0.6, ease, delay: 0.4 } }}
              exit={{ width: 0, opacity: 0, transition: { duration: 0.35, ease } }}
            >
              Tap for music
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="controls"
              className="flex items-center overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1, transition: { duration: 0.5, ease } }}
              exit={{ width: 0, opacity: 0, transition: { duration: 0.35, ease } }}
            >
              <div className="flex items-center gap-0.5 pl-3 pr-1 sm:gap-1 sm:pr-2">{/* phones: no slider (the device buttons set the volume), so the open player clears the back-to-top button */}
                <div className="mr-1 w-[6.25rem] sm:w-[9.5rem]">
                  <p className="flex items-center gap-1.5 whitespace-nowrap type-label text-stone">
                    <Music className="size-3" strokeWidth={1.75} aria-hidden="true" />
                    {playing ? 'Playing' : 'Music'}
                  </p>
                  <p className="truncate font-display text-[0.95rem] leading-tight" aria-live="polite">
                    {t.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next track"
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ivory-deep"
                >
                  <SkipForward className="size-4" strokeWidth={1.6} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Unmute music' : 'Mute music'}
                  aria-pressed={muted}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ivory-deep"
                >
                  {muted || volume === 0 ? <VolumeX className="size-4" strokeWidth={1.6} aria-hidden="true" /> : <Volume2 className="size-4" strokeWidth={1.6} aria-hidden="true" />}
                </button>
                <label className="hidden items-center pr-2 sm:flex">
                  <span className="sr-only">Music volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVolume(v);
                      setMuted(v === 0);
                    }}
                    className="music-volume w-14 sm:w-24"
                    style={{ '--fill': `${(muted ? 0 : volume) * 100}%` }}
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
