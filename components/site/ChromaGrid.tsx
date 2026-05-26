'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export interface ChromaGridItem {
  icon?: React.ElementType;
  image?: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url: string;
}

interface ChromaGridProps {
  items?: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((v: number) => void) | null>(null);
  const setY = useRef<((v: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaGridItem[] = [
    {
      image: 'https://cdn.simpleicons.org/github/ffffff',
      title: 'GitHub',
      subtitle: 'Code & Open Source',
      handle: ' @senesh2006',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #000)',
      url: 'https://github.com/senesh2006'
    },
    {
      image: 'https://cdn.simpleicons.org/linkedin/ffffff',
      title: 'LinkedIn',
      subtitle: 'Professional Network',
      handle: ' @peter-senesh',
      borderColor: '#0A66C2',
      gradient: 'linear-gradient(210deg, #0A66C2, #000)',
      url: 'https://www.linkedin.com/in/peter-senesh'
    },
    {
      image: 'https://cdn.simpleicons.org/x/ffffff',
      title: 'X',
      subtitle: 'Social Feed',
      handle: ' @SeneshF',
      borderColor: '#1da1f2',
      gradient: 'linear-gradient(165deg, #1da1f2, #000)',
      url: 'https://x.com/SeneshF'
    },
    {
      image: 'https://cdn.simpleicons.org/googlescholar/ffffff',
      title: 'Google Scholar',
      subtitle: 'Research & Publications',
      handle: ' @SeneshF',
      borderColor: '#4285F4',
      gradient: 'linear-gradient(195deg, #4285F4, #000)',
      url: 'https://scholar.google.com/citations?user=BQ7naRAAAAAJ&hl=en'
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeRef.current) {
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
        gsap.to(fadeRef.current, {
          opacity: 1,
          duration: fadeOut,
          overwrite: true
        });
    }
  };

  const handleCardClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      } as React.CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            cursor: c.url ? 'pointer' : 'default'
          } as React.CSSProperties}
        >
          <div className="chroma-img-wrapper">
            {c.icon ? (
              <c.icon className="w-16 h-16 text-white opacity-80" />
            ) : c.image ? (
              <img src={c.image} alt={c.title} loading="lazy" />
            ) : null}
          </div>
          <footer className="chroma-info">
            <div className="flex flex-col">
              <h3 className="name text-lg font-bold">{c.title}</h3>
              <p className="role text-xs">{c.subtitle}</p>
            </div>
            {c.handle && <span className="handle text-xs self-start">{c.handle}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
