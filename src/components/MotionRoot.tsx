import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/** Page-local reduced-motion gate. Stays out of the app-shell graph. */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
