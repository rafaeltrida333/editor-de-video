import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TextItem} from '../types';

const justify = {top: 'flex-start', center: 'center', bottom: 'flex-end'} as const;

export const TextComp: React.FC<{item: TextItem}> = ({item}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = item.fade ?? 0;
  const opacity =
    fade > 0
      ? interpolate(
          frame,
          [0, fade, item.durationInFrames - fade, item.durationInFrames],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        )
      : 1;

  const scale =
    item.animation === 'pop' ? spring({frame, fps, config: {damping: 12, stiffness: 180}}) : 1;

  const text =
    item.animation === 'typewriter'
      ? item.text.slice(0, Math.floor(frame / 2))
      : item.text;

  return (
    <AbsoluteFill
      style={{
        justifyContent: justify[item.position ?? 'center'],
        alignItems: 'center',
        padding: '8%',
        opacity,
      }}
    >
      <div
        style={{
          // With y, the text is centered on that height instead of using position.
          ...(item.y === undefined
            ? {}
            : {position: 'absolute', top: `${item.y}%`, translate: '0 -50%'}),
          color: item.color,
          fontSize: item.fontSize ?? 80,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          lineHeight: 1.1,
          textShadow: item.background ? undefined : '0 4px 24px rgba(0, 0, 0, 0.6)',
          background: item.background,
          padding: item.background ? '0.2em 0.5em' : undefined,
          borderRadius: item.background ? '0.3em' : undefined,
          transform: `rotate(${item.rotate ?? 0}deg) scale(${scale})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
