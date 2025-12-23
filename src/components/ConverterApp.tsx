import React, { useEffect, useMemo, useRef, useState } from "react";
import { FileCode, Zap } from "lucide-react";
import { Converter } from "./Converter.tsx";

const UI_THEME = "light";

export const ConverterApp: React.FC = () => {
  return (
    <div
      data-theme={UI_THEME}
      className="min-h-screen bg-base-200 text-base-content font-sans selection:bg-base-300"
    >
      <nav className="border-b border-base-300 bg-base-100/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center text-neutral-content">
              <FileCode size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">md2html</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Documentation</a>
            <button className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">GitHub</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 text-xs font-bold uppercase tracking-wider mb-4 border border-base-300">
            <Zap size={14} />
            <span>Tailwind v4 Powered</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Markdown to professional <br /> 
            <span className="opacity-70">HTML in seconds.</span>
          </h1>
          <p className="text-xl opacity-80 leading-relaxed">
            Create beautiful, self-contained HTML documents from Markdown. 
            Tailwind v4 + typography for great readability.
          </p>
        </header>

        <Converter />
      </main>

      <footer className="border-t border-base-300 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center opacity-60 text-sm">
          <p>© 2025 md2html. Built with Bun, React, and Tailwind CSS v4.</p>
        </div>
      </footer>
    </div>
  );
};

