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
};

export type VideoItem = BaseItem & {
  type: 'video';
  src: string;
};

export type Item = SolidItem | TextItem | VideoItem;

export type Track = {
  id: string;
  name: string;
  items: Item[];
};

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;
