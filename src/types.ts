import type {Caption} from '@remotion/captions';

// How an item appears or disappears. Overlapping items on different tracks
// turn these into transitions between them.
export type TransitionType = 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'wipe';

export type Transition = {
  type: TransitionType;
  durationInFrames: number;
};

type BaseItem = {
  id: string;
  from: number;
  durationInFrames: number;
  enter?: Transition;
  exit?: Transition;
};

export type SolidItem = BaseItem & {
  type: 'solid';
  color: string;
  opacity?: number;
};

export type TextItem = BaseItem & {
  type: 'text';
  text: string;
  color: string;
  position?: 'top' | 'center' | 'bottom';
  // Vertical position in % of the height; overrides position.
  y?: number;
  fontSize?: number;
  background?: string;
  rotate?: number;
  animation?: 'none' | 'pop' | 'typewriter';
  // Frames to fade in and out.
  fade?: number;
};

// A zoom level that starts at a frame of the item (a "punch-in" cut).
export type Zoom = {
  at: number;
  scale: number;
};

export type VideoItem = BaseItem & {
  type: 'video';
  // A URL, or a file name inside the public folder when rendering.
  src: string;
  // Source frames to skip at the start of the video.
  trimBefore?: number;
  volume?: number;
  zooms?: Zoom[];
  grade?: {brightness?: number; contrast?: number; saturate?: number};
  vignette?: boolean;
};

export type CaptionsItem = BaseItem & {
  type: 'captions';
  // Times are relative to the start of the item.
  captions: Caption[];
  color?: string;
  highlightColor?: string;
  fontSize?: number;
  y?: number;
};

export type ProgressItem = BaseItem & {
  type: 'progress';
  color: string;
};

export type Item = SolidItem | TextItem | VideoItem | CaptionsItem | ProgressItem;

export const itemLabels: Record<Item['type'], string> = {
  solid: 'Cor',
  text: 'Texto',
  video: 'Vídeo',
  captions: 'Legendas',
  progress: 'Progresso',
};

export type Track = {
  id: string;
  name: string;
  items: Item[];
};

export type Project = {
  width: number;
  height: number;
  tracks: Track[];
};

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;

export const getDurationInFrames = (tracks: Track[]) => {
  const ends = tracks.flatMap((t) => t.items.map((i) => i.from + i.durationInFrames));
  return Math.max(FPS * 5, ...ends);
};
