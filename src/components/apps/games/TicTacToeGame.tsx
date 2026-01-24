import React, { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';

type Cell = 'X' | 'O' | null;

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const TicTacToeGame = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');

  const winner = useMemo(() => {
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
  }, [board]);

  const full = board.every(Boolean);
  const status = winner ? `Winner: ${winner}` : full ? 'Draw' : `Turn: ${turn}`;

  return (
    <div className="w-full max-w-[520px] flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="text-sm font-semibold">{status}</div>
        <button
          className="h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          onClick={() => {
            setBoard(Array(9).fill(null));
            setTurn('X');
          }}
        >
          Restart
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={cn(
              'aspect-square rounded-2xl border border-border bg-background text-4xl font-black transition-colors',
              'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40'
            )}
            onClick={() => {
              if (winner || board[idx]) return;
              setBoard((prev) => {
                const next = [...prev];
                next[idx] = turn;
                return next;
              });
              setTurn((t) => (t === 'X' ? 'O' : 'X'));
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">Click a cell to place X/O</div>
    </div>
  );
};
