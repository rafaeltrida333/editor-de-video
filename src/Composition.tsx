import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence} from 'remotion';
import type {Item, Track} from './types';

const ItemComp: React.FC<{item: Item}> = ({item}) => {
  if (item.type === 'solid') {
    return <AbsoluteFill style={{backgroundColor: item.color}} />;
  }

  if (item.type === 'text') {
    return (
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: item.color,
          fontSize: 80,
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
        }}
      >
        {item.text}
      </AbsoluteFill>
    );
  }

  return <OffthreadVideo src={item.src} />;
};

// The first track is drawn on top, like in most editors.
export const Composition: React.FC<{tracks: Track[]}> = ({tracks}) => {
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
