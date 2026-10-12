import React from 'react';
import {Composition as RemotionComposition} from 'remotion';
import {Composition} from '../Composition';
import {FPS, getDurationInFrames, HEIGHT, WIDTH, type Project} from '../types';

const defaultProject: Project = {width: WIDTH, height: HEIGHT, tracks: []};

export const Root: React.FC = () => {
  return (
    <RemotionComposition
      id="Editor"
      component={Composition}
      defaultProps={defaultProject}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      durationInFrames={FPS * 5}
      calculateMetadata={({props}) => ({
        width: props.width ?? WIDTH,
        height: props.height ?? HEIGHT,
        durationInFrames: getDurationInFrames(props.tracks),
      })}
    />
  );
};
