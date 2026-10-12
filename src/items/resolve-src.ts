import {staticFile} from 'remotion';

// URLs are used as they are; plain file names are read from the public folder.
export const resolveSrc = (src: string) =>
  /^(https?:|blob:|data:)/.test(src) ? src : staticFile(src);
