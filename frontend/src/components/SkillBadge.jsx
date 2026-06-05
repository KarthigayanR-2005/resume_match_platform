import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export default function SkillBadge({ name, type = 'general' }) {
  const getStyles = () => {
    switch (type) {
      case 'present':
        return {
          bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: <Check className="w-3 h-3 text-emerald-400 shrink-0" />
        };
      case 'missing':
        return {
          bg: 'bg-rose-500/10 hover:bg-rose-500/15',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          icon: <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
        };
      default: // general
        return {
          bg: 'bg-slate-800/60 hover:bg-slate-800/90',
          border: 'border-slate-700/50',
          text: 'text-slate-300',
          icon: null
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border ${styles.bg} ${styles.border} ${styles.text} transition-all duration-200 select-none shadow-sm cursor-default hover:scale-[1.02]`}
    >
      {styles.icon}
      {name}
    </span>
  );
}
