import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useElementSize } from '@/components/apps/games/useElementSize';

type Dir = 'up' | 'down' | 'left' | 'right';
type Point = { x: number; y: number };

const keyToDir: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const deltaFor = (d: Dir) =>
  d === 'up' ? { x: 0, y: -1 } : d === 'down' ? { x: 0, y: 1 } : d === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 };

export const PacmanGame = () => {
  const level = useMemo(
    () =>
      [
        '###############',
        '#.............#',
        '#.###.###.###.#',
        '#.#...#...#...#',
        '#.#.#####.#.###',
        '#.#.....#.#...#',
        '#.###.#.#.###.#',
        '#.....#.#.....#',
        '###.###.###.###',
        '#.............#',
        '#.###.###.###.#',
        '#...#.....#...#',
        '###.#.###.#.###',
        '#.............#',
        '###############',
      ],
    []
  );

  const cols = level[0].length;
  const rows = level.length;
  const cell = 18;
  const w = cols * cell;
  const h = rows * cell;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const accRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);

  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const wonRef = useRef(false);
  const scoreRef = useRef(0);

  const pacRef = useRef<Point>({ x: 1, y: 1 });
  const dirRef = useRef<Dir>('right');
  const wishRef = useRef<Dir>('right');
  const ghostsRef = useRef<Point[]>([{ x: 7, y: 7 }, { x: 13, y: 13 }]);

  const pelletsInit = useMemo(() => {
    const set = new Set<string>();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (level[y][x] === '.') set.add(`${x},${y}`);
      }
    }
    set.delete('1,1');
    return set;
  }, [cols, rows, level]);

  const pelletsRef = useRef<Set<string>>(new Set(pelletsInit));

  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

  const isWall = (x: number, y: number) => level[y]?.[x] === '#';

  const reset = () => {
    pacRef.current = { x: 1, y: 1 };
    dirRef.current = 'right';
    wishRef.current = 'right';
    ghostsRef.current = [{ x: 7, y: 7 }, { x: 13, y: 13 }];
    pelletsRef.current = new Set(pelletsInit);
    scoreRef.current = 0;
    runningRef.current = false;
    gameOverRef.current = false;
    wonRef.current = false;
    setScore(0);
    setRunning(false);
    setGameOver(false);
    setWon(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (isWall(x, y)) {
          ctx.fillStyle = '#1D4ED8';
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }

    ctx.fillStyle = '#F59E0B';
    pelletsRef.current.forEach((k) => {
      const [x, y] = k.split(',').map(Number);
      ctx.beginPath();
      ctx.arc(x * cell + cell / 2, y * cell + cell / 2, 2.6, 0, Math.PI * 2);
      ctx.fill();
    });

    const pac = pacRef.current;
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(pac.x * cell + cell / 2, pac.y * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#DC2626';
    ghostsRef.current.forEach((g) => {
      ctx.beginPath();
      ctx.arc(g.x * cell + cell / 2, g.y * cell + cell / 2, cell * 0.38, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#F9FAFB';
    ctx.font = 'bold 14px ui-sans-serif, system-ui';
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 16);

    if (!runningRef.current && !gameOverRef.current && !wonRef.current) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '600 12px ui-sans-serif, system-ui';
      ctx.fillText('Press an arrow key to start', 10, 32);
    }
    if (gameOverRef.current) {
      ctx.fillStyle = '#DC2626';
      ctx.font = '800 14px ui-sans-serif, system-ui';
      ctx.fillText('Game Over', 10, 32);
    }
    if (wonRef.current) {
      ctx.fillStyle = '#16A34A';
      ctx.font = '800 14px ui-sans-serif, system-ui';
      ctx.fillText('You win!', 10, 32);
    }
  };

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const nd = keyToDir[e.key];
      if (!nd) return;
      e.preventDefault();
      wishRef.current = nd;
      if (!gameOverRef.current && !wonRef.current) {
        runningRef.current = true;
        setRunning(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const stepMs = 120;
    const loop = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = Math.min(0.05, (t - lastRef.current) / 1000);
      lastRef.current = t;
      accRef.current += dt * 1000;

      while (accRef.current >= stepMs) {
        accRef.current -= stepMs;

        if (runningRef.current && !gameOverRef.current && !wonRef.current) {
          const tryDir = (d: Dir) => {
            const del = deltaFor(d);
            const nx = pacRef.current.x + del.x;
            const ny = pacRef.current.y + del.y;
            return !isWall(nx, ny);
          };
          const nextDir = tryDir(wishRef.current) ? wishRef.current : tryDir(dirRef.current) ? dirRef.current : dirRef.current;
          dirRef.current = nextDir;

          const del = deltaFor(nextDir);
          const nx = pacRef.current.x + del.x;
          const ny = pacRef.current.y + del.y;
          if (!isWall(nx, ny)) pacRef.current = { x: nx, y: ny };

          const pelletKey = `${pacRef.current.x},${pacRef.current.y}`;
          if (pelletsRef.current.has(pelletKey)) {
            pelletsRef.current.delete(pelletKey);
            scoreRef.current += 10;
            setScore(scoreRef.current);
          }

          ghostsRef.current = ghostsRef.current.map((g) => {
            const dirs: Dir[] = ['up', 'down', 'left', 'right'];
            const available = dirs.filter((d) => {
              const del = deltaFor(d);
              return !isWall(g.x + del.x, g.y + del.y);
            });
            const pick = available[Math.floor(Math.random() * available.length)] ?? 'left';
            const del = deltaFor(pick);
            return { x: g.x + del.x, y: g.y + del.y };
          });

          const hit = ghostsRef.current.some((g) => g.x === pacRef.current.x && g.y === pacRef.current.y);
          if (hit) {
            gameOverRef.current = true;
            runningRef.current = false;
            setGameOver(true);
            setRunning(false);
            break;
          }

          if (pelletsRef.current.size === 0) {
            wonRef.current = true;
            runningRef.current = false;
            setWon(true);
            setRunning(false);
            break;
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
  }, [rows, cols, level]);

  return (
    <div className="w-full max-w-[560px]" ref={containerRef}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full max-w-[420px]">
          <div className="text-sm font-semibold">Score: {score}</div>
          <div className="flex items-center gap-2">
            <button
              className="h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={reset}
            >
              New
            </button>
            <button
              className="h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors"
              onClick={() =>
                setRunning((r) => {
                  if (gameOverRef.current || wonRef.current) return r;
                  const next = !r;
                  runningRef.current = next;
                  return next;
                })
              }
              disabled={gameOver || won}
            >
              {running ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          className="rounded-2xl border border-border"
          style={(() => {
            const max = 520;
            const width = Math.max(240, Math.min(size.width || max, max));
            return { width, height: width * (h / w) };
          })()}
        />
        <div className="text-xs text-muted-foreground">Use arrow keys to move. Eat all dots.</div>
      </div>
    </div>
  );
};

