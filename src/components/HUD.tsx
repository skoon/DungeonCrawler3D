import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';
import { Heart, Zap, Sword, Shield } from 'lucide-react';
import { PartyMember } from '../types';

const PartyMemberCard: React.FC<{ member: PartyMember; isActive: boolean; onClick: () => void }> = ({ member, isActive, onClick }) => {
  const hpPercent = (member.stats.hp / member.stats.maxHp) * 100;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex-1 flex gap-4 p-4 transition-all border-t-2 cursor-pointer
        ${isActive ? 'bg-indigo-900/10 border-indigo-500 opacity-100' : 'bg-brand-surface border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}
      `}
    >
      <div className="w-12 h-12 bg-zinc-800 rounded-sm shrink-0" />
      <div className="flex flex-col text-left overflow-hidden">
        <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{member.name}</h4>
        <p className="text-[10px] text-zinc-400 mt-0.5">HP {member.stats.hp}/{member.stats.maxHp}</p>
        <div className="mt-2 h-1 w-20 bg-zinc-800 rounded-full overflow-hidden">
           <div className="h-full bg-red-500 transition-all" style={{ width: `${hpPercent}%` }} />
        </div>
      </div>
    </motion.button>
  );
};

const MiniMap: React.FC = () => {
  const { state } = useGame();
  const level = state.dungeons[state.currentLevelId];
  if (!level) return null;

  const getRotation = (dir: string) => {
    switch(dir) {
      case 'N': return 'rotate-0';
      case 'E': return 'rotate-90';
      case 'S': return 'rotate-180';
      case 'W': return 'rotate-270';
      default: return 'rotate-0';
    }
  };

  return (
    <div className="mt-8 relative group">
      <div className="flex justify-between items-center mb-3 border-b border-brand-border pb-1">
        <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Tactical Scan</h4>
        <div className="flex gap-1">
           <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
           <span className="text-[8px] text-indigo-400 font-black uppercase tracking-tighter">Live Sync</span>
        </div>
      </div>
      
      <div className="relative aspect-video bg-[#050505] border border-brand-border p-3 overflow-hidden">
        {/* Cardinal Markers */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-zinc-600 font-black">N</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-zinc-600 font-black">S</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600 font-black">W</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600 font-black">E</span>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-20" />

        <div 
          className="grid gap-px h-full"
          style={{ gridTemplateColumns: `repeat(${level.width}, 1fr)` }}
        >
          {level.grid.map((row, y) => (
            row.map((tile, x) => {
              const isPlayer = state.playerPosition.x === x && state.playerPosition.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    aspect-square transition-colors duration-500 flex items-center justify-center
                    ${isPlayer ? 'z-10' : ''}
                    ${!isPlayer && tile === 'wall' ? 'bg-indigo-500/20 shadow-[inset_0_0_2px_rgba(79,70,229,0.3)]' : 'bg-transparent'}
                    ${!isPlayer && tile === 'floor' ? 'bg-zinc-900/10' : ''}
                  `}
                >
                  {isPlayer && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`w-full h-full flex items-center justify-center`}
                    >
                      <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-bottom-[6px] border-bottom-indigo-500 drop-shadow-[0_0_4px_rgba(79,70,229,1)] ${getRotation(state.playerDirection)}`} />
                    </motion.div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      
      {/* HUD Info Labels */}
      <div className="mt-2 flex justify-between px-1">
          <div className="flex gap-2">
             <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-indigo-500/20 border border-indigo-500/40" /> <span className="text-[7px] uppercase text-zinc-600">Wall</span></div>
             <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-indigo-500" /> <span className="text-[7px] uppercase text-zinc-600">Unit</span></div>
          </div>
          <span className="text-[7px] uppercase text-zinc-500 font-mono tracking-tighter">Rad: 250m</span>
      </div>
    </div>
  );
};

const ActiveMemberView: React.FC<{ member: PartyMember }> = ({ member }) => {
  return (
    <aside className="w-64 border-r border-brand-border flex flex-col bg-brand-surface h-full">
      <div className="p-6 border-b border-brand-border">
        <div className="w-full aspect-square bg-[#1C1C1F] border border-[#3F3F46] flex items-center justify-center mb-4 transition-all hover:border-indigo-500/50">
          <Sword className="text-white opacity-40" size={32} />
        </div>
        <h2 className="text-lg font-bold text-white uppercase tracking-tight">{member.name}</h2>
        <p className="text-[10px] uppercase tracking-widest text-indigo-400 mb-6">{member.class} • Level {member.stats.level}</p>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] uppercase text-zinc-500 font-black"><span>Vitality</span><span>{member.stats.hp}%</span></div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${(member.stats.hp/member.stats.maxHp)*100}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] uppercase text-zinc-500 font-black"><span>Essence</span><span>{member.stats.mp}%</span></div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${(member.stats.mp/member.stats.maxMp)*100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-4">Inventory</h3>
        <div className="grid grid-cols-3 gap-2">
          {member.inventory.slice(0, 9).map((_, i) => (
             <div key={i} className="aspect-square bg-zinc-800 border border-zinc-700 hover:border-indigo-400/50 cursor-pointer transition-colors" />
          ))}
        </div>
        
        <MiniMap />
      </div>
    </aside>
  );
};

const ActionPanel: React.FC = () => {
    const [cooldown, setCooldown] = React.useState(0);
    
    React.useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => Math.max(0, c - 10)), 100);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleAttack = () => {
        if (cooldown > 0) return;
        setCooldown(1000);
    };

    return (
        <div className="flex gap-1">
            <button 
                onClick={handleAttack}
                disabled={cooldown > 0}
                className={`
                    px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all
                    ${cooldown > 0 ? 'opacity-50 grayscale' : 'glow-indigo'}
                `}
            >
                {cooldown > 0 ? `Resetting System` : 'Combat Action'}
            </button>
            <button className="px-6 py-3 bg-zinc-900 border border-brand-border text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                Guard
            </button>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { state, selectMember } = useGame();
  const activeMember = state.party[state.activeMemberIndex];

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text overflow-hidden">
      {/* Custom Tool Header */}
      <header className="h-12 border-b border-brand-border flex items-center justify-between px-6 bg-brand-surface shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-indigo-600 rounded-sm"></div>
          <h1 className="text-xs font-bold tracking-[0.2em] text-brand-heading uppercase">Dungeon Architect // v1.0.4</h1>
        </div>
        <div className="flex gap-6 text-[10px] uppercase font-black tracking-widest text-zinc-500">
          <span className="text-indigo-400 underline decoration-2 underline-offset-4">Active Search</span>
          <span className="hover:text-white cursor-pointer transition-colors">Tactical Log</span>
          <span className="hover:text-white cursor-pointer transition-colors">Neural Sync</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ActiveMemberView member={activeMember} />
        
        <main className="flex-1 flex flex-col bg-[#050505] relative cursor-crosshair">
          {/* Main Rendering Stage */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Perspective Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo-500"></div>
                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-indigo-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]" />
            </div>
            
            <div id="game-view-container" className="glow-indigo" />
          </div>

          <div className="h-20 bg-brand-surface border-t border-brand-border flex items-center justify-between px-8">
              <ActionPanel />
              
              <div className="flex gap-6 items-center">
                  <div className="text-right">
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Sector Coordinate</p>
                      <p className="text-sm font-mono text-white">X:{state.playerPosition.x} Y:{state.playerPosition.y} D:{state.playerDirection}</p>
                  </div>
                  
                  <div className="w-[1px] h-8 bg-brand-border" />

                  <div className="flex gap-4 text-zinc-500 font-mono text-[9px] uppercase font-black">
                    <div className="flex flex-col items-center">
                        <div className="bg-zinc-800 px-2 py-1 border border-brand-border text-brand-heading mb-1 uppercase">W</div>
                        <span>Move</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-zinc-800 px-2 py-1 border border-brand-border text-brand-heading mb-1 uppercase">A D</div>
                        <span>Turn</span>
                    </div>
                </div>
              </div>
          </div>
        </main>
      </div>

      <div className="h-24 bg-brand-surface border-t border-brand-border flex items-stretch overflow-hidden">
        <div className="w-64 border-r border-brand-border flex items-center justify-center p-4 shrink-0 bg-brand-bg/50">
           <div className="text-center group cursor-help">
             <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-1 group-hover:text-indigo-400 transition-colors">Sync Rate</p>
             <p className="text-lg font-mono text-white">98.4<span className="text-indigo-600">%</span></p>
          </div>
        </div>
        <div className="flex-1 flex gap-px bg-brand-border">
            {state.party.map((member, i) => (
                <PartyMemberCard 
                    key={member.id} 
                    member={member} 
                    isActive={state.activeMemberIndex === i}
                    onClick={() => selectMember(i)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};
