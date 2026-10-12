import React, {useMemo} from 'react';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionsItem} from '../types';

// Shows a few words at a time and highlights the word being spoken.
export const CaptionsComp: React.FC<{item: CaptionsItem}> = ({item}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const {pages} = useMemo(
    () => createTikTokStyleCaptions({captions: item.captions, combineTokensWithinMilliseconds: 1200}),
    [item.captions],
  );

  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) {
    return null;
  }

  const scale = spring({
    frame: frame - Math.round((page.startMs / 1000) * fps),
    fps,
    config: {damping: 14, stiffness: 220},
  });

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: `${item.y ?? 70}%`,
          translate: '0 -50%',
          fontSize: item.fontSize ?? 72,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          textTransform: 'uppercase',
          textAlign: 'center',
          whiteSpace: 'pre',
          padding: '0 6%',
          textShadow: '0 0 8px black, 0 0 8px black, 0 6px 0 black',
          transform: `scale(${0.8 + 0.2 * scale})`,
        }}
      >
        {page.tokens.map((t) => (
          <span
            key={t.fromMs}
            style={{
              color: ms >= t.fromMs && ms < t.toMs ? (item.highlightColor ?? '#facc15') : (item.color ?? 'white'),
            }}
          >
            {t.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
