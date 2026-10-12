import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {PlayerRef} from '@remotion/player';
import {itemLabels, type Item, type Track} from './types';

const PX_PER_FRAME = 4;
const TRACK_HEIGHT = 48;

type Drag = {
  itemId: string;
  mode: 'move' | 'resize';
  startX: number;
  startFrom: number;
  startDuration: number;
};

export const Timeline: React.FC<{
  tracks: Track[];
  durationInFrames: number;
  playerRef: React.RefObject<PlayerRef | null>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateItem: (id: string, patch: Partial<Item>) => void;
}> = ({tracks, durationInFrames, playerRef, selectedId, onSelect, onUpdateItem}) => {
  const [frame, setFrame] = useState(0);
  const drag = useRef<Drag | null>(null);

  // Keep the playhead in sync with the Player.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const onFrame = (e: {detail: {frame: number}}) => setFrame(e.detail.frame);
    player.addEventListener('frameupdate', onFrame);
    return () => player.removeEventListener('frameupdate', onFrame);
  }, [playerRef]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d) {
        return;
      }

      const delta = Math.round((e.clientX - d.startX) / PX_PER_FRAME);
      if (d.mode === 'move') {
        onUpdateItem(d.itemId, {from: Math.max(0, d.startFrom + delta)});
      } else {
        onUpdateItem(d.itemId, {
          durationInFrames: Math.max(1, d.startDuration + delta),
        });
      }
    },
    [onUpdateItem],
  );

  useEffect(() => {
    const onUp = () => {
      drag.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [onPointerMove]);

  const startDrag = (e: React.PointerEvent, item: Item, mode: Drag['mode']) => {
    e.stopPropagation();
    onSelect(item.id);
    drag.current = {
      itemId: item.id,
      mode,
      startX: e.clientX,
      startFrom: item.from,
      startDuration: item.durationInFrames,
    };
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const f = Math.round((e.clientX - rect.left) / PX_PER_FRAME);
    playerRef.current?.seekTo(Math.min(durationInFrames - 1, Math.max(0, f)));
    onSelect(null);
  };

  return (
    <div className="timeline">
      <div className="track-names">
        <div className="ruler-spacer" />
        {tracks.map((t) => (
          <div key={t.id} className="track-name" style={{height: TRACK_HEIGHT}}>
            {t.name}
          </div>
        ))}
      </div>
      <div className="track-area">
        <div
          className="track-content"
          style={{width: durationInFrames * PX_PER_FRAME}}
          onPointerDown={seek}
        >
          <div className="ruler">
            {Array.from({length: Math.ceil(durationInFrames / 30)}, (_, s) => (
              <span key={s} style={{left: s * 30 * PX_PER_FRAME}}>
                {s}s
              </span>
            ))}
          </div>
          {tracks.map((t) => (
            <div key={t.id} className="track" style={{height: TRACK_HEIGHT}}>
              {t.items.map((item) => (
                <div
                  key={item.id}
                  className={`item item-${item.type} ${selectedId === item.id ? 'selected' : ''}`}
                  style={{
                    left: item.from * PX_PER_FRAME,
                    width: item.durationInFrames * PX_PER_FRAME,
                  }}
                  onPointerDown={(e) => startDrag(e, item, 'move')}
                >
                  <span>{item.type === 'text' ? item.text : itemLabels[item.type]}</span>
                  <div
                    className="resize-handle"
                    onPointerDown={(e) => startDrag(e, item, 'resize')}
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="playhead" style={{left: frame * PX_PER_FRAME}} />
        </div>
      </div>
    </div>
  );
};
