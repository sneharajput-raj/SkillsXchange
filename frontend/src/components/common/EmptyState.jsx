import React from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({ icon: Icon = Sparkles, title, description, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center sm:p-12 dark:bg-[#18181b]/40 dark:border-[#3f3f46]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0fdfa] text-[#0d9488] shadow-inner dark:bg-[#0f766e]/20 dark:text-[#5eead4]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
