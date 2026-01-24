import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

type Card = { id: string; value: string };

const shuffle = (arr: Card[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const MemoryGame = () => {
  const base = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], []);
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => {
    const cards: Card[] = [];
    base.forEach((v) => {
      cards.push({ id: `${v}-1`, value: v });
      cards.push({ id: `${v}-2`, value: v });
    });
    return shuffle(cards);
  }, [base, seed]);

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [moves, setMoves] = useState(0);
  const lockRef = useRef(false);

  const allMatched = Object.keys(matched).length === base.length;

  useEffect(() => {
    if (open.length !== 2) return;
    const [i, j] = open;
    const a = deck[i];
    const b = deck[j];
    lockRef.current = true;
    const t = window.setTimeout(() => {
      if (a.value === b.value) {
        setMatched((prev) => ({ ...prev, [a.value]: true }));
      }
      setOpen([]);
      lockRef.current = false;
    }, 650);
    return () => window.clearTimeout(t);
  }, [open, deck]);

  return (
    <div className="w-full max-w-[620px] flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="text-sm font-semibold">Moves: {moves}</div>
        <button
          className="h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          onClick={() => {
            setOpen([]);
            setMatched({});
            setMoves(0);
            setSeed((s) => s + 1);
          }}
        >
          Restart
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full">
        {deck.map((card, idx) => {
          const isOpen = open.includes(idx);
          const isDone = !!matched[card.value];
          const show = isOpen || isDone;
          return (
            <button
              key={card.id}
              className={cn(
                'aspect-square rounded-2xl border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40',
                show ? 'bg-background' : 'bg-muted hover:bg-muted/70'
              )}
              onClick={() => {
                if (lockRef.current) return;
                if (isDone) return;
                if (open.includes(idx)) return;
                setMoves((m) => m + 1);
                setOpen((prev) => {
                  if (prev.length >= 2) return prev;
                  return [...prev, idx];
                });
              }}
            >
              <div className={cn('text-3xl font-black', show ? 'text-foreground' : 'text-muted-foreground')}>
                {show ? card.value : '?'}
              </div>
            </button>
          );
        })}
      </div>

      {allMatched ? (
        <div className="text-sm font-semibold text-green-600">You win!</div>
      ) : (
        <div className="text-xs text-muted-foreground">Flip two cards and find a match</div>
      )}
    </div>
  );
};
