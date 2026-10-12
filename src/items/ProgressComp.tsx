import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {ProgressItem} from '../types';

export const ProgressComp: React.FC<{item: ProgressItem}> = ({item}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          height: 12,
          width: `${(frame / item.durationInFrames) * 100}%`,
          background: item.color,
        }}
      />
    </AbsoluteFill>
  );
};
