/* Chrome-free shell for OBS browser sources — no navbar, lenis, or ambient audio. */
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import '@/pages/overlay/overlay.css';

export default function OverlayShell() {
  useEffect(() => {
    document.documentElement.classList.add('overlay-mode');
    document.body.classList.add('overlay-mode');
    return () => {
      document.documentElement.classList.remove('overlay-mode');
      document.body.classList.remove('overlay-mode');
    };
  }, []);

  return (
    <div className="overlay-root min-h-0 bg-transparent text-tx-primary">
      <Outlet />
    </div>
  );
}
