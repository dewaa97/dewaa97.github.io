import React, { useEffect, useRef, useState } from 'react';
import { useElementSize } from '@/components/apps/games/useElementSize';

type Point = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const keyToDir: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const isOpposite = (a: Dir, b: Dir) =>
  (a === 'up' && b === 'down') ||
  (a === 'down' && b === 'up') ||
  (a === 'left' && b === 'right') ||
  (a === 'right' && b === 'left');

export const SnakeGame = () => {
  const cols = 20;
  const rows = 20;
  const baseCell = 18;
  const baseW = cols * baseCell;
  const baseH = rows * baseCell;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const accRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir>('right');
  const foodRef = useRef<Point>({ x: 14, y: 10 });

  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

  const spawnFood = (current: Set<string>) => {
    for (let i = 0; i < 500; i++) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (!current.has(`${x},${y}`)) return { x, y };
    }
    return { x: 0, y: 0 };
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const nd = keyToDir[e.key];
      if (!nd) return;
      e.preventDefault();
      const prev = nextDirRef.current;
      nextDirRef.current = isOpposite(prev, nd) ? prev : nd;
      if (!gameOverRef.current) {
        runningRef.current = true;
        setRunning(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, baseW, baseH);
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(0, 0, baseW, baseH);

    ctx.fillStyle = '#16A34A';
    snakeRef.current.forEach((p, idx) => {
      const pad = idx === 0 ? 2 : 3;
      ctx.fillRect(p.x * baseCell + pad, p.y * baseCell + pad, baseCell - pad * 2, baseCell - pad * 2);
    });

    const food = foodRef.current;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(food.x * baseCell + baseCell / 2, food.y * baseCell + baseCell / 2, baseCell * 0.32, 0, Math.PI * 2);
    ctx.fill();

    if (!runningRef.current && !gameOverRef.current) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '600 14px ui-sans-serif, system-ui';
      ctx.fillText('Press an arrow key to start', 10, 18);
    }
    if (gameOverRef.current) {
      ctx.fillStyle = '#DC2626';
      ctx.font = '800 16px ui-sans-serif, system-ui';
      ctx.fillText('Game Over', 10, 18);
    }
  };

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const stepMs = 95;

    const loop = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = Math.min(0.05, (t - lastRef.current) / 1000);
      lastRef.current = t;
      accRef.current += dt * 1000;

      while (accRef.current >= stepMs) {
        accRef.current -= stepMs;
        if (runningRef.current && !gameOverRef.current) {
          const nd = nextDirRef.current;
          const head = snakeRef.current[0];
          const delta = nd === 'up' ? { x: 0, y: -1 } : nd === 'down' ? { x: 0, y: 1 } : nd === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 };
          const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

          if (nextHead.x < 0 || nextHead.x >= cols || nextHead.y < 0 || nextHead.y >= rows) {
            gameOverRef.current = true;
            runningRef.current = false;
            setGameOver(true);
            setRunning(false);
            break;
          }

          const hit = snakeRef.current.some((p) => p.x === nextHead.x && p.y === nextHead.y);
          if (hit) {
            gameOverRef.current = true;
            runningRef.current = false;
            setGameOver(true);
            setRunning(false);
            break;
          }

          const food = foodRef.current;
          const ate = nextHead.x === food.x && nextHead.y === food.y;
          const nextSnake = [nextHead, ...snakeRef.current];
          if (!ate) nextSnake.pop();

          snakeRef.current = nextSnake;
          dirRef.current = nd;

          if (ate) {
            const newScore = scoreRef.current + 1;
            scoreRef.current = newScore;
            setScore(newScore);
            const setOcc = new Set<string>();
            nextSnake.forEach((p) => setOcc.add(`${p.x},${p.y}`));
            foodRef.current = spawnFood(setOcc);
          }
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cols, rows]);

  return (
    <div className="w-full max-w-[560px]" ref={containerRef}>
      <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full max-w-[420px]">
        <div className="text-sm font-semibold">Score: {score}</div>
        <div className="flex items-center gap-2">
          <button
            className="h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={() => {
              snakeRef.current = [{ x: 10, y: 10 }];
              foodRef.current = { x: 14, y: 10 };
              dirRef.current = 'right';
              nextDirRef.current = 'right';
              scoreRef.current = 0;
              runningRef.current = false;
              gameOverRef.current = false;
              setScore(0);
              setGameOver(false);
              setRunning(false);
            }}
          >
            New
          </button>
          <button
            className="h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors"
            onClick={() =>
              setRunning((r) => {
                const next = !r;
                runningRef.current = next;
                return next;
              })
            }
            disabled={gameOver}
          >
            {running ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={baseW}
        height={baseH}
        className="rounded-2xl border border-border"
        style={(() => {
          const max = 420;
          const width = Math.max(220, Math.min(size.width || max, max));
          return { width, height: width };
        })()}
      />
      <div className="text-xs text-muted-foreground">Use arrow keys to move. Press an arrow key to start.</div>
      {gameOver && <div className="text-sm font-semibold text-red-600">Game Over</div>}
      </div>
    </div>
  );
};
