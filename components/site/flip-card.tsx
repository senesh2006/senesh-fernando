'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Github, Linkedin, Twitter, ExternalLink }  from 'lucide-react';

export type FlipCardData = {
  name: string;
  username: string;
  image: string;
  bio: string;
  stats: { following: number; followers: number; posts: number };
  socialLinks: { linkedin?: string; github?: string; twitter?: string };
};

const PLATFORM_META: Record<string, { icon: React.ReactNode; color: string; label: string; urlKey: keyof FlipCardData['socialLinks'] }> = {
  linkedin: { icon: <Linkedin className="w-4 h-4" />, color: 'text-[#0A66C2]', label: 'LinkedIn', urlKey: 'linkedin' },
  github:   { icon: <Github className="w-4 h-4" />,   color: 'text-foreground',      label: 'GitHub',   urlKey: 'github' },
  twitter:  { icon: <Twitter className="w-4 h-4" />,  color: 'text-foreground',      label: 'X / Twitter', urlKey: 'twitter' },
};

type FlipCardProps = {
  data: FlipCardData;
  platform: 'linkedin' | 'github' | 'twitter';
  className?: string;
};

export function FlipCard({ data, platform, className }: FlipCardProps) {
  const meta = PLATFORM_META[platform];
  const url = meta.urlKey ? data.socialLinks[meta.urlKey] : undefined;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group perspective-[1000px] block w-full max-w-[320px] mx-auto',
        className
      )}
    >
      <div className="relative w-full aspect-[4/5] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)]">
        {/* FRONT (logo) */}
        <div className="absolute inset-1 rounded-xl border border-border bg-background [backface-visibility:hidden] flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className={cn('w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center', meta.color)}>
              {meta.icon}
            </div>
            <div className="font-semibold">{meta.label}</div>
            <div className="font-mono text-xs text-muted-foreground">@{data.username}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {platform === 'linkedin' && 'Connect for professional updates, project collabs and work history.'}
              {platform === 'github'   && 'Open-source work, side projects and contribution graphs live here.'}
              {platform === 'twitter'  && 'Hot takes on frontend, occasional memes and build-in-public threads.'}
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
              visit profile <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* BACK (profile) */}
        <div className="absolute inset-1 rounded-xl border border-border bg-muted/40 [backface-visibility:hidden] [transform:rotateY(-180deg)] flex flex-col overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-muted to-background border-b border-border relative">
            <div className="absolute -bottom-8 left-5">
              <img
                src={data.image}
                alt={data.name}
                className="w-16 h-16 rounded-full border-4 border-background bg-background object-cover"
              />
            </div>
          </div>
          <div className="flex-1 px-5 pt-10 pb-5 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{data.name}</span>
              <span className={cn('opacity-0 group-hover:opacity-100 transition-opacity', meta.color)}>
                {meta.icon}
              </span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">@{data.username}</div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-4">
              {data.bio}
            </p>
            <div className="mt-auto pt-4 flex gap-4 text-xs font-mono text-muted-foreground">
              <span><strong className="text-foreground">{data.stats.following}</strong> following</span>
              <span><strong className="text-foreground">{data.stats.followers}</strong> followers</span>
              <span><strong className="text-foreground">{data.stats.posts}</strong> posts</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
