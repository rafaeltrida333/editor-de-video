import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {Composition} from './Composition';
import {Timeline} from './Timeline';
import {FPS, HEIGHT, WIDTH, type Item, type Track} from './types';

const newId = () => Math.random().toString(36).slice(2, 10);

const initialTracks: Track[] = [
  {
    id: 'texto',
    name: 'Texto',
    items: [
      {id: newId(), type: 'text', text: 'Olá!', color: '#ffffff', from: 0, durationInFrames: 60},
    ],
  },
  {id: 'video', name: 'Vídeo', items: []},
  {
    id: 'fundo',
    name: 'Fundo',
    items: [{id: newId(), type: 'solid', color: '#4f46e5', from: 0, durationInFrames: 150}],
  },
];

export const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const playerRef = useRef<PlayerRef>(null);

  // The video lasts until the last item ends (minimum 5 seconds).
  const durationInFrames = useMemo(() => {
    const ends = tracks.flatMap((t) => t.items.map((i) => i.from + i.durationInFrames));
    return Math.max(FPS * 5, ...ends);
  }, [tracks]);

  const selected = useMemo(
    () => tracks.flatMap((t) => t.items).find((i) => i.id === selectedId) ?? null,
    [tracks, selectedId],
  );

  const updateItem = useCallback((id: string, patch: Partial<Item>) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        items: t.items.map((i) => (i.id === id ? ({...i, ...patch} as Item) : i)),
      })),
    );
  }, []);

  // New items start at the playhead, or after the last item of the track so they don't overlap.
  const addItem = (trackId: string, item: Item) => {
    const track = tracks.find((t) => t.id === trackId);
    const trackEnd = Math.max(0, ...(track?.items ?? []).map((i) => i.from + i.durationInFrames));
    const placed = {...item, from: Math.max(item.from, trackEnd)};
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? {...t, items: [...t.items, placed]} : t)),
    );
    setSelectedId(item.id);
  };

  const currentFrame = () => playerRef.current?.getCurrentFrame() ?? 0;

  const deleteSelected = () => {
    setTracks((prev) =>
      prev.map((t) => ({...t, items: t.items.filter((i) => i.id !== selectedId)})),
    );
    setSelectedId(null);
  };

  return (
    <div className="app">
      <header className="toolbar">
        <strong>Editor de vídeo</strong>
        <button
          onClick={() =>
            addItem('texto', {
              id: newId(),
              type: 'text',
              text: 'Novo texto',
              color: '#ffffff',
              from: currentFrame(),
              durationInFrames: 60,
            })
          }
        >
          + Texto
        </button>
        <button
          onClick={() =>
            addItem('fundo', {
              id: newId(),
              type: 'solid',
              color: '#16a34a',
              from: currentFrame(),
              durationInFrames: 60,
            })
          }
        >
          + Cor
        </button>
        <input
          placeholder="URL de um vídeo .mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button
          disabled={!videoUrl}
          onClick={() => {
            addItem('video', {
              id: newId(),
              type: 'video',
              src: videoUrl,
              from: currentFrame(),
              durationInFrames: FPS * 5,
            });
            setVideoUrl('');
          }}
        >
          + Vídeo
        </button>
      </header>

      <main className="workspace">
        <div className="preview">
          <Player
            ref={playerRef}
            component={Composition}
            inputProps={{tracks}}
            durationInFrames={durationInFrames}
            fps={FPS}
            compositionWidth={WIDTH}
            compositionHeight={HEIGHT}
            style={{width: '100%'}}
            controls
          />
        </div>

        <aside className="inspector">
          {selected ? (
            <>
              <h3>{selected.type === 'text' ? 'Texto' : selected.type === 'solid' ? 'Cor' : 'Vídeo'}</h3>
              {selected.type === 'text' && (
                <label>
                  Texto
                  <input
                    value={selected.text}
                    onChange={(e) => updateItem(selected.id, {text: e.target.value})}
                  />
                </label>
              )}
              {(selected.type === 'text' || selected.type === 'solid') && (
                <label>
                  Cor
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(e) => updateItem(selected.id, {color: e.target.value})}
                  />
                </label>
              )}
              <label>
                Duração (frames)
                <input
                  type="number"
                  min={1}
                  value={selected.durationInFrames}
                  onChange={(e) =>
                    updateItem(selected.id, {durationInFrames: Math.max(1, Number(e.target.value))})
                  }
                />
              </label>
              <button className="danger" onClick={deleteSelected}>
                Excluir
              </button>
            </>
          ) : (
            <p className="hint">Clique num item da timeline para editar.</p>
          )}
        </aside>
      </main>

      <Timeline
        tracks={tracks}
        durationInFrames={durationInFrames}
        playerRef={playerRef}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onUpdateItem={updateItem}
      />
    </div>
  );
};
