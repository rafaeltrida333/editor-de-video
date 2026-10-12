import type React from 'react';
import {Easing, interpolate} from 'remotion';
import type {Transition} from './types';

// progress 0 = hidden, 1 = fully shown.
const styleFor = (type: Transition['type'], progress: number, isExit: boolean) => {
  const hidden = 1 - progress;
  const dir = isExit ? -1 : 1;
  switch (type) {
    case 'fade':
      return {opacity: progress};
    case 'slide-up':
      return {transform: `translateY(${dir * hidden * 100}%)`};
    case 'slide-left':
      return {transform: `translateX(${dir * hidden * 100}%)`};
    case 'zoom':
      return {opacity: progress, transform: `scale(${1 + hidden * 0.3})`};
    case 'wipe':
      return {clipPath: `inset(0 ${hidden * 100}% 0 0)`};
  }
};

export const transitionStyle = (
  frame: number,
  durationInFrames: number,
  enter?: Transition,
  exit?: Transition,
): React.CSSProperties => {
  const ease = {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  } as const;

  if (enter && frame < enter.durationInFrames) {
    return styleFor(enter.type, interpolate(frame, [0, enter.durationInFrames], [0, 1], ease), false);
  }

  if (exit && frame >= durationInFrames - exit.durationInFrames) {
    return styleFor(
      exit.type,
      interpolate(frame, [durationInFrames - exit.durationInFrames, durationInFrames], [1, 0], ease),
      true,
    );
  }

  return {};
};
