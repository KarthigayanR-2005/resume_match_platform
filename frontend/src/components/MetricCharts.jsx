import React, { useEffect, useState } from 'react';

export function MatchRing({ score, size = 160, strokeWidth = 12 }) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate the circle fill on mount
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const getScoreColors = (val) => {
    if (val >= 80) return {
      stroke: 'url(#greenGradient)',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400',
      track: 'stroke-emerald-950/40'
    };
    if (val >= 60) return {
      stroke: 'url(#amberGradient)',
      glow: 'shadow-amber-500/20',
      text: 'text-amber-400',
      track: 'stroke-amber-950/40'
    };
    return {
      stroke: 'url(#roseGradient)',
      glow: 'shadow-rose-500/20',
      text: 'text-rose-400',
      track: 'stroke-rose-950/40'
    };
  };

  const colors = getScoreColors(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          className={colors.track}
          strokeWidth={strokeWidth}
        />
        
        {/* Filled Progress Arc */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold tracking-tight ${colors.text} font-mono animate-fadeIn`}>
          {score.toFixed(0)}%
        </span>
        <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Alignment</span>
      </div>
    </div>
  );
}

export function CategoryBar({ label, percentage, matchedCount, totalCount }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getColor = (pct) => {
    if (pct >= 85) return 'from-emerald-500 to-teal-500';
    if (pct >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-400 font-mono">
          {matchedCount} / {totalCount} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className={`h-full bg-gradient-to-r ${getColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
