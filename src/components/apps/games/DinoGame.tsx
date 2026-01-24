import React, { useEffect, useRef, useState } from 'react';
import { useElementSize } from '@/components/apps/games/useElementSize';

type Obstacle = { x: number; w: number; h: number };

export const DinoGame = () => {
  const w = 560;
  const h = 220;
  const groundY = 170;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const uiAccRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);

  const playerRef = useRef({ x: 60, y: groundY, vy: 0, size: 28 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const spawnRef = useRef(0);
  const speedRef = useRef(260);

  const reset = () => {
    playerRef.current = { x: 60, y: groundY, vy: 0, size: 28 };
    obstaclesRef.current = [];
    spawnRef.current = 0;
    speedRef.current = 260;
    scoreRef.current = 0;
    runningRef.current = false;
    gameOverRef.current = false;
    setScore(0);
    setGameOver(false);
    setRunning(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      if (gameOverRef.current) return;
      runningRef.current = true;
      setRunning(true);
      const p = playerRef.current;
      if (p.y >= groundY) p.vy = -520;
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

  useEffect(() => {
    const loop = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = Math.min(0.05, (t - lastRef.current) / 1000);
      lastRef.current = t;

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0B0B0B';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 16);
      ctx.lineTo(w, groundY + 16);
      ctx.stroke();

      if (runningRef.current && !gameOverRef.current) {
        scoreRef.current += dt * 100;
        uiAccRef.current += dt;
        if (uiAccRef.current >= 0.12) {
          uiAccRef.current = 0;
          setScore(Math.floor(scoreRef.current));
        }
        speedRef.current = Math.min(520, speedRef.current + dt * 12);

        spawnRef.current -= dt;
        if (spawnRef.current <= 0) {
          const ow = 18 + Math.floor(Math.random() * 18);
          const oh = 22 + Math.floor(Math.random() * 28);
          obstaclesRef.current.push({ x: w + 10, w: ow, h: oh });
          spawnRef.current = 0.9 + Math.random() * 0.8;
        }

        const p = playerRef.current;
        p.vy += 1400 * dt;
        p.y += p.vy * dt;
        if (p.y > groundY) {
          p.y = groundY;
          p.vy = 0;
        }

        obstaclesRef.current = obstaclesRef.current
          .map((o) => ({ ...o, x: o.x - speedRef.current * dt }))
          .filter((o) => o.x + o.w > -20);

        const px1 = p.x;
        const py1 = p.y - p.size;
        const px2 = p.x + p.size;
        const py2 = p.y;

        for (const o of obstaclesRef.current) {
          const ox1 = o.x;
          const oy1 = groundY + 16 - o.h;
          const ox2 = o.x + o.w;
          const oy2 = groundY + 16;
          const hit = px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1;
          if (hit) {
            gameOverRef.current = true;
            runningRef.current = false;
            setGameOver(true);
            setRunning(false);
            break;
          }
        }
      }

      const p = playerRef.current;
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(p.x, p.y - p.size, p.size, p.size);

      ctx.fillStyle = '#F59E0B';
      obstaclesRef.current.forEach((o) => {
        const y = groundY + 16 - o.h;
        ctx.fillRect(o.x, y, o.w, o.h);
      });

      ctx.fillStyle = '#F9FAFB';
      ctx.font = 'bold 16px ui-sans-serif, system-ui';
      ctx.fillText(`Score: ${Math.floor(scoreRef.current)}`, 16, 22);

      if (!runningRef.current && !gameOverRef.current) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '600 14px ui-sans-serif, system-ui';
        ctx.fillText('Press Space / ArrowUp to start & jump', 16, 46);
      }

      if (gameOverRef.current) {
        ctx.fillStyle = '#DC2626';
        ctx.font = '800 18px ui-sans-serif, system-ui';
        ctx.fillText('Game Over', 16, 46);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-[560px]" ref={containerRef}>
      <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full">
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
            onClick={() => {
              if (gameOverRef.current) return;
              setRunning((r) => {
                const next = !r;
                runningRef.current = next;
                return next;
              });
            }}
            disabled={gameOver}
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
          const max = 560;
          const width = Math.max(240, Math.min(size.width || max, max));
          return { width, height: width * (h / w) };
        })()}
      />
      <div className="text-xs text-muted-foreground">Press Space or ArrowUp to jump</div>
      </div>
    </div>
  );
};
