type BaseItem = {
  id: string;
  from: number;
  durationInFrames: number;
};

export type SolidItem = BaseItem & {
  type: 'solid';
  color: string;
};

export type TextItem = BaseItem & {
  type: 'text';
  text: string;
  color: string;
  position?: 'top' | 'center' | 'bottom';
  fontSize?: number;
  // Frames to fade in and out.
  fade?: number;
};

export type VideoItem = BaseItem & {
  type: 'video';
  // A URL, or a file name inside the public folder when rendering.
  src: string;
  // Source frames to skip at the start of the video.
  trimBefore?: number;
  volume?: number;
};

export type Item = SolidItem | TextItem | VideoItem;

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
