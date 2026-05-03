/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { HUD } from './components/HUD';
import PhaserGame from './components/PhaserGame';
import Editor from './components/Editor/Editor';
import { LayoutGrid, Sword } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'play' | 'edit'>('play');

  return (
    <GameProvider>
      <div className="h-screen bg-black overflow-hidden relative">
        {mode === 'play' ? (
          <div className="flex flex-col h-full">
            <HUD />
            {/* Phaser Game is hosted within the HUD's main area via absolute positioning or just a separate container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-32 -mt-16">
               <PhaserGame />
            </div>
          </div>
        ) : (
          <Editor onBack={() => setMode('play')} />
        )}

        {/* Global Mode Toggle */}
        <div className="absolute top-4 right-4 flex bg-brand-surface border border-brand-border p-1 rounded-sm z-50 shadow-2xl">
          <button
            onClick={() => setMode('play')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'play' ? 'bg-indigo-600 text-white glow-indigo' : 'text-zinc-500 hover:text-white'}`}
          >
            <Sword size={14} /> Mission
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'edit' ? 'bg-indigo-600 text-white glow-indigo' : 'text-zinc-500 hover:text-white'}`}
          >
            <LayoutGrid size={14} /> Architect
          </button>
        </div>
      </div>
    </GameProvider>
  );
}

