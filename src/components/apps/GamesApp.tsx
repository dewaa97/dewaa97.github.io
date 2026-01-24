import React, { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { SnakeGame } from '@/components/apps/games/SnakeGame';
import { PacmanGame } from '@/components/apps/games/PacmanGame';
import { DinoGame } from '@/components/apps/games/DinoGame';
import { TicTacToeGame } from '@/components/apps/games/TicTacToeGame';
import { MemoryGame } from '@/components/apps/games/MemoryGame';

type GameId = 'snake' | 'pacman' | 'dino' | 'tictactoe' | 'memory';

export const GamesApp = () => {
  const [selected, setSelected] = useState<GameId | null>(null);
  const [instance, setInstance] = useState(0);

  const games = useMemo(
    () =>
      [
        { id: 'snake' as const, name: 'Snake', hint: 'Arrow keys' },
        { id: 'pacman' as const, name: 'Pacman', hint: 'Arrow keys' },
        { id: 'dino' as const, name: 'Dino Runner', hint: 'Space / ArrowUp' },
        { id: 'tictactoe' as const, name: 'Tic-tac-toe', hint: 'Click' },
        { id: 'memory' as const, name: 'Memory', hint: 'Click' },
      ],
    []
  );

  const Stage = (() => {
    if (!selected) return null;
    switch (selected) {
      case 'snake':
        return <SnakeGame key={`${selected}-${instance}`} />;
      case 'pacman':
        return <PacmanGame key={`${selected}-${instance}`} />;
      case 'dino':
        return <DinoGame key={`${selected}-${instance}`} />;
      case 'tictactoe':
        return <TicTacToeGame key={`${selected}-${instance}`} />;
      case 'memory':
        return <MemoryGame key={`${selected}-${instance}`} />;
      default:
        return null;
    }
  })();

  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <div className="w-full md:w-[260px] shrink-0 md:border-r border-border bg-background border-b md:border-b-0">
        <div className="px-4 py-3">
          <div className="text-sm font-semibold">Games</div>
          <div className="text-xs text-muted-foreground mt-1">Pick a game to start</div>
        </div>
        <div className="px-2 pb-2">
          {games.map((g) => (
            <button
              key={g.id}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                selected === g.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              )}
              onClick={() => {
                setSelected(g.id);
                setInstance((x) => x + 1);
              }}
            >
              <div className="text-sm font-medium">{g.name}</div>
              <div className={cn('text-xs mt-0.5', selected === g.id ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                {g.hint}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 shrink-0 border-b border-border flex items-center justify-between px-4 bg-background">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{selected ? games.find((g) => g.id === selected)?.name : 'Games'}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                'h-9 px-3 rounded-xl text-sm font-semibold transition-colors',
                selected ? 'bg-muted hover:bg-muted/70 text-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
              disabled={!selected}
              onClick={() => setInstance((x) => x + 1)}
            >
              Restart
            </button>
            <button
              className={cn(
                'h-9 px-3 rounded-xl text-sm font-semibold transition-colors',
                selected ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground/70 cursor-not-allowed'
              )}
              disabled={!selected}
              onClick={() => {
                setSelected(null);
                setInstance((x) => x + 1);
              }}
            >
              Back
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-card">
          {selected ? (
            <div className="h-full w-full flex items-center justify-center p-4">{Stage}</div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              Select a game from the left panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
