import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Sparkles className="h-3 w-3" />
          </div>
          <span className="font-semibold text-slate-700">SkillSwap</span>
          <span>— Peer-to-Peer Knowledge Exchange</span>
        </div>
        <p className="flex items-center gap-1">
          Built for College Minor Project with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> &bull; Spring Boot + React
        </p>
      </div>
    </footer>
  );
}

export default Footer;
