import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type {Item, TextItem, Track} from './types';

const resolveSrc = (src: string) =>
  /^(https?:|blob:|data:)/.test(src) ? src : staticFile(src);

const justify = {top: 'flex-start', center: 'center', bottom: 'flex-end'} as const;

const TextComp: React.FC<{item: TextItem}> = ({item}) => {
  const frame = useCurrentFrame();
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

  return (
    <AbsoluteFill
      style={{
        justifyContent: justify[item.position ?? 'center'],
        alignItems: 'center',
        padding: '8%',
        textAlign: 'center',
        color: item.color,
        fontSize: item.fontSize ?? 80,
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        textShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
        opacity,
      }}
    >
      {item.text}
    </AbsoluteFill>
  );
};

const ItemComp: React.FC<{item: Item}> = ({item}) => {
  if (item.type === 'solid') {
    return <AbsoluteFill style={{backgroundColor: item.color}} />;
  }

  if (item.type === 'text') {
    return <TextComp item={item} />;
  }

  return (
    <OffthreadVideo
      src={resolveSrc(item.src)}
      trimBefore={item.trimBefore}
      volume={item.volume}
    />
  );
};

// The first track is drawn on top, like in most editors.
// width and height are only read when rendering (see src/remotion/Root.tsx).
export const Composition: React.FC<{
  tracks: Track[];
  width?: number;
  height?: number;
}> = ({tracks}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {[...tracks].reverse().map((track) => (
        <AbsoluteFill key={track.id}>
          {track.items.map((item) => (
            <Sequence
              key={item.id}
              from={item.from}
              durationInFrames={item.durationInFrames}
            >
              <ItemComp item={item} />
            </Sequence>
          ))}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
