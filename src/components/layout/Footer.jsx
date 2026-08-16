import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#293730] bg-[#141917] py-6 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-[#659F84]" />
          <span className="font-heading font-bold text-slate-300">Habit Rescue</span>
        </div>
        <p>© {new Date().getFullYear()} Habit Rescue. Empowering habit recovery.</p>
      </div>
    </footer>
  );
}
