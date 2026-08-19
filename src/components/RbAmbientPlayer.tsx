/* Loop Route 1 overworld music when ambient audio is enabled. */
import { useEffect, useRef } from 'react';
import {
  AMBIENT_CHANGE_EVENT,
  RB_ROUTES1_SRC,
  readAmbientEnabled,
  readAmbientVolume,
} from '@/lib/rb-ambient-audio';

export default function RbAmbientPlayer() {
  const enabledRef = useRef(readAmbientEnabled());
  const volumeRef = useRef(readAmbientVolume());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ensureAudio = () => {
      if (!audioRef.current) {
        const audio = new Audio(RB_ROUTES1_SRC);
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;
      }
      return audioRef.current;
    };

    const stop = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    };

    const play = async () => {
      const audio = ensureAudio();
      audio.volume = volumeRef.current;
      try {
        await audio.play();
      } catch {
        /* autoplay policy — user must interact first */
      }
    };

    const sync = () => {
      enabledRef.current = readAmbientEnabled();
      volumeRef.current = readAmbientVolume();
      const audio = audioRef.current;
      if (audio) audio.volume = volumeRef.current;
      if (!enabledRef.current) {
        stop();
        return;
      }
      void play();
    };

    sync();
    window.addEventListener(AMBIENT_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener(AMBIENT_CHANGE_EVENT, sync);
      stop();
      audioRef.current = null;
    };
  }, []);

  return null;
}
