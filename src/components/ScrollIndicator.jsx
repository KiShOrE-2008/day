import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator({ label = "Scroll to begin story" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
      <span className="text-[11px] font-mono tracking-widest uppercase text-white/50">
        {label}
      </span>
      <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1">
        <div className="w-1 h-2 bg-[#B76E79] rounded-full animate-bounce" />
      </div>
    </div>
  );
}
