import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame} from 'remotion';
import {CaptionsComp} from './items/CaptionsComp';
import {ProgressComp} from './items/ProgressComp';
import {TextComp} from './items/TextComp';
import {resolveSrc} from './items/resolve-src';
import {VideoComp} from './items/VideoComp';
import {transitionStyle} from './transitions';
import type {Item, Track} from './types';

const ItemContent: React.FC<{item: Item}> = ({item}) => {
  switch (item.type) {
    case 'solid':
      return <AbsoluteFill style={{backgroundColor: item.color, opacity: item.opacity ?? 1}} />;
    case 'text':
      return <TextComp item={item} />;
    case 'video':
      return <VideoComp item={item} />;
    case 'captions':
      return <CaptionsComp item={item} />;
    case 'progress':
      return <ProgressComp item={item} />;
    case 'audio':
      return <Audio src={resolveSrc(item.src)} volume={item.volume} />;
  }
};

const ItemComp: React.FC<{item: Item}> = ({item}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={transitionStyle(frame, item.durationInFrames, item.enter, item.exit)}>
      <ItemContent item={item} />
    </AbsoluteFill>
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
