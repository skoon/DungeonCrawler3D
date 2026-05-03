import React, { useState, useEffect } from 'react';
import { TileType, Position, DungeonLevel } from '../../types';
import { createEmptyDungeon } from '../../utils/dungeonGenerator';
import { MoveLeft, Save, Trash2, Box, Ghost, DoorOpen, Square } from 'lucide-react';
import { motion } from 'motion/react';

interface EditorProps {
  onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ onBack }) => {
  const [level, setLevel] = useState<DungeonLevel>(createEmptyDungeon(16, 16));
  const [selectedTool, setSelectedTool] = useState<TileType | 'enemy' | 'item'>('wall');
  const [selectedEnemyType, setSelectedEnemyType] = useState<string>('goblin');

  const handleTileClick = (x: number, y: number) => {
    if (selectedTool === 'enemy') {
        const exists = level.enemies.find(e => e.pos.x === x && e.pos.y === y);
        if (exists) {
            setLevel({ ...level, enemies: level.enemies.filter(e => e.pos.x !== x || e.pos.y !== y) });
        } else {
            setLevel({ ...level, enemies: [...level.enemies, { type: selectedEnemyType, pos: { x, y } }] });
        }
        return;
    }

    if (selectedTool === 'item') {
        const exists = level.items.find(i => i.pos.x === x && i.pos.y === y);
        if (exists) {
            setLevel({ ...level, items: level.items.filter(i => i.pos.x !== x || i.pos.y !== y) });
        } else {
            setLevel({ ...level, items: [...level.items, { type: 'potion', pos: { x, y } }] });
        }
        return;
    }

    if (typeof selectedTool === 'string') {
      const newGrid = [...level.grid];
      newGrid[y][x] = selectedTool as TileType;
      setLevel({ ...level, grid: newGrid });
    }
  };

  const clearDungeon = () => {
    if (confirm('Are you sure you want to clear the dungeon?')) {
      setLevel(createEmptyDungeon(16, 16));
    }
  };

  const saveDungeon = () => {
    const data = JSON.stringify(level);
    localStorage.setItem('custom-dungeon', data);
    alert('Dungeon saved to local storage!');
  };

  const shareDungeon = () => {
    try {
      const data = JSON.stringify(level);
      const encoded = btoa(encodeURIComponent(data));
      const url = new URL(window.location.href);
      url.hash = `dungeon=${encoded}`;
      navigator.clipboard.writeText(url.toString());
      alert('Neural Link copied to clipboard! Share it with other architects.');
    } catch (e) {
      alert('Failed to encode link. The dungeon might be too large.');
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text overflow-hidden">
      {/* Selection Palette Sidebar */}
      <aside className="w-72 border-r border-brand-border bg-brand-surface flex flex-col shrink-0">
        <div className="p-4 border-b border-brand-border flex justify-between items-center bg-brand-bg/50">
          <span className="text-[10px] uppercase font-black text-brand-heading tracking-widest">Entity Palette</span>
          <button 
            onClick={onBack}
            className="p-1 hover:text-white text-zinc-600 transition-colors"
          >
             <MoveLeft size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <section>
            <h5 className="text-[9px] text-zinc-500 uppercase font-black mb-3 tracking-[0.2em]">Architecture</h5>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'wall', label: 'Wall' },
                { id: 'floor', label: 'Floor' },
                { id: 'door', label: 'Door' },
                { id: 'void', label: 'Void' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as any)}
                  className={`aspect-square border bg-zinc-800 transition-all ${selectedTool === tool.id ? 'border-indigo-500 p-1 bg-zinc-700' : 'border-zinc-700 hover:border-zinc-500'}`}
                  title={tool.label}
                >
                  <div className={`w-full h-full ${
                    tool.id === 'wall' ? 'bg-zinc-600' : 
                    tool.id === 'floor' ? 'bg-zinc-900' : 
                    tool.id === 'door' ? 'bg-amber-900/50' : 
                    'bg-black'
                  }`} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h5 className="text-[9px] text-zinc-500 uppercase font-black mb-3 tracking-[0.2em]">Entities</h5>
            <div className="space-y-2">
              {[
                { id: 'enemy', icon: Ghost, label: 'Hostile Unit', sub: 'Enemy NPC', color: 'text-red-500' },
                { id: 'item', icon: Box, label: 'Resource Node', sub: 'Item Container', color: 'text-blue-500' },
              ].map((tool) => (
                <div key={tool.id} className="flex flex-col gap-1">
                  <button
                     onClick={() => setSelectedTool(tool.id as any)}
                     className={`
                      w-full flex items-center gap-3 p-3 bg-[#1C1C1F] border transition-all cursor-pointer
                      ${selectedTool === tool.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-800 hover:border-zinc-700'}
                     `}
                  >
                    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <tool.icon size={16} className={tool.color} />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{tool.label}</p>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-tighter truncate">{tool.sub}</p>
                    </div>
                  </button>
                  {tool.id === 'enemy' && selectedTool === 'enemy' && (
                      <div className="mt-2 px-1">
                        <select 
                          value={selectedEnemyType}
                          onChange={(e) => setSelectedEnemyType(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold p-2 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <option value="goblin">Goblin</option>
                          <option value="orc">Orc</option>
                          <option value="skeleton">Skeleton</option>
                        </select>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h5 className="text-[9px] text-zinc-500 uppercase font-black mb-3 tracking-[0.2em]">Dungeon Blueprint</h5>
            <div className="w-full aspect-video bg-[#050505] border border-zinc-800 p-1 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Square className="text-zinc-800" size={24} />
            </div>
          </section>
        </div>

        <div className="p-4 bg-zinc-900/50 space-y-2 border-t border-brand-border">
          <button 
            onClick={shareDungeon}
            className="w-full bg-indigo-900/40 border border-indigo-500/50 hover:bg-indigo-900/60 text-indigo-100 text-[10px] font-black uppercase py-2 tracking-[0.2em] transition-all rounded-sm"
          >
            Share Neural Link
          </button>
          <button 
            onClick={saveDungeon}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase py-3 tracking-[0.2em] transition-all glow-indigo"
          >
            Deploy Dungeon
          </button>
          <button 
            onClick={clearDungeon}
            className="w-full bg-zinc-900 border border-brand-border text-zinc-500 hover:text-white text-[10px] font-black uppercase py-2 tracking-widest transition-all"
          >
            Clear Canvas
          </button>
        </div>
      </aside>

      {/* Main Editing Canvas */}
      <main className="flex-1 overflow-auto bg-[#050505] p-12 flex items-center justify-center relative">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="bg-brand-surface p-1 rounded-sm shadow-2xl border border-brand-border glow-indigo relative z-10">
           <div 
             className="grid border border-brand-border bg-brand-border overflow-hidden rounded-sm"
             style={{ 
               gridTemplateColumns: `repeat(${level.width}, 1fr)`,
               gap: '1px'
             }}
           >
              {level.grid.map((row, y) => (
                row.map((tile, x) => {
                  const hasEnemy = level.enemies.find(e => e.pos.x === x && e.pos.y === y);
                  const hasItem = level.items.find(i => i.pos.x === x && i.pos.y === y);
                  
                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleTileClick(x, y)}
                      className={`
                        w-8 h-8 cursor-pointer transition-all relative flex items-center justify-center
                        ${tile === 'wall' ? 'bg-zinc-700' : ''}
                        ${tile === 'floor' ? 'bg-[#0A0A0B]' : ''}
                        ${tile === 'door' ? 'bg-amber-900/40' : ''}
                        ${tile === 'void' ? 'bg-black' : ''}
                        hover:brightness-150 hover:z-20 hover:scale-105
                      `}
                    >
                        {hasEnemy && (
                          <>
                            <Ghost size={12} className="text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]" />
                            <span className="absolute bottom-0 right-0.5 text-[6px] text-red-300 font-bold uppercase">{hasEnemy.type[0]}</span>
                          </>
                        )}
                        {hasItem && <Box size={12} className="text-blue-500 drop-shadow-[0_0_2px_rgba(59,130,246,0.5)]" />}
                    </div>
                  );
                })
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
