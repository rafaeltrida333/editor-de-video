import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import type {VideoItem, Zoom} from '../types';

const ZOOM_FRAMES = 5;

const resolveSrc = (src: string) =>
  /^(https?:|blob:|data:)/.test(src) ? src : staticFile(src);

// Scale at a frame, easing quickly from the previous zoom level into the next one.
// Also returns a blur that peaks during the change, like a whip zoom.
const getZoom = (zooms: Zoom[], frame: number) => {
  const sorted = [...zooms].sort((a, b) => a.at - b.at);
  let previous = 1;
  for (let i = 0; i < sorted.length; i++) {
    const z = sorted[i];
    const next = sorted[i + 1];
    if (frame < z.at) {
      break;
    }

    if (next && frame >= next.at) {
      previous = z.scale;
      continue;
    }

    const t = interpolate(frame, [z.at, z.at + ZOOM_FRAMES], [0, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp',
    });
    return {scale: previous + (z.scale - previous) * t, blur: Math.sin(t * Math.PI) * 6};
  }

  return {scale: previous, blur: 0};
};

export const VideoComp: React.FC<{item: VideoItem}> = ({item}) => {
  const frame = useCurrentFrame();
  const {scale, blur} = getZoom(item.zooms ?? [], frame);
  const g = item.grade ?? {};
  const filter = [
    `brightness(${g.brightness ?? 1})`,
    `contrast(${g.contrast ?? 1})`,
    `saturate(${g.saturate ?? 1})`,
    blur > 0.1 ? `blur(${blur}px)` : '',
  ].join(' ');

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 40%', filter}}>
        <OffthreadVideo
          src={resolveSrc(item.src)}
          trimBefore={item.trimBefore}
          volume={item.volume}
        />
      </AbsoluteFill>
      {item.vignette && (
        <AbsoluteFill
          style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%)'}}
        />
      )}
    </AbsoluteFill>
  );
};
