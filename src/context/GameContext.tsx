import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, PartyMember, Direction, Position } from '../types';
import { createSampleDungeon } from '../utils/dungeonGenerator';

interface GameContextType {
  state: GameState;
  moveForward: () => void;
  moveBackward: () => void;
  turnLeft: () => void;
  turnRight: () => void;
  selectMember: (index: number) => void;
  updateMember: (index: number, updates: Partial<PartyMember>) => void;
  updatePosition: (pos: Position) => void;
  updateDirection: (dir: Direction) => void;
}


const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const initialDungeon = createSampleDungeon();
    let startingDungeon = initialDungeon;
    
    // Check URL for shared dungeon first
    const hash = window.location.hash;
    if (hash.startsWith('#dungeon=')) {
        try {
            const encoded = hash.substring(9);
            const decoded = decodeURIComponent(atob(encoded));
            startingDungeon = JSON.parse(decoded);
        } catch (e) {
            console.error("Failed to load shared dungeon from URL", e);
        }
    } else {
        const savedDungeon = localStorage.getItem('custom-dungeon');
        if (savedDungeon) {
            try {
                const parsed = JSON.parse(savedDungeon);
                startingDungeon = {
                    ...parsed,
                    grid: parsed.grid || initialDungeon.grid
                };
            } catch (e) {
                console.error("Failed to parse saved dungeon", e);
            }
        }
    }

    return {
      party: [
        {
          id: '1',
          name: 'Kaelen',
          class: 'Warrior',
          type: 'player',
          stats: { hp: 100, maxHp: 100, mp: 20, maxMp: 20, str: 15, def: 10, level: 1, xp: 0 },
          position: startingDungeon.startPos,
          direction: startingDungeon.startDir,
          inventory: Array(12).fill(null),
          equipped: { weapon: null, armor: null }
        },
        {
          id: '2',
          name: 'Elowen',
          class: 'Mage',
          type: 'player',
          stats: { hp: 60, maxHp: 60, mp: 100, maxMp: 100, str: 5, def: 5, level: 1, xp: 0 },
          position: startingDungeon.startPos,
          direction: startingDungeon.startDir,
          inventory: Array(12).fill(null),
          equipped: { weapon: null, armor: null }
        },
        {
          id: '3',
          name: 'Thistle',
          class: 'Rogue',
          type: 'player',
          stats: { hp: 80, maxHp: 80, mp: 40, maxMp: 40, str: 10, def: 8, level: 1, xp: 0 },
          position: startingDungeon.startPos,
          direction: startingDungeon.startDir,
          inventory: Array(12).fill(null),
          equipped: { weapon: null, armor: null }
        },
        {
          id: '4',
          name: 'Merrick',
          class: 'Cleric',
          type: 'player',
          stats: { hp: 90, maxHp: 90, mp: 60, maxMp: 60, str: 10, def: 12, level: 1, xp: 0 },
          position: startingDungeon.startPos,
          direction: startingDungeon.startDir,
          inventory: Array(12).fill(null),
          equipped: { weapon: null, armor: null }
        }
      ],
      activeMemberIndex: 0,
      currentLevelId: startingDungeon.id,
      dungeons: { [startingDungeon.id]: startingDungeon },
      playerPosition: startingDungeon.startPos,
      playerDirection: startingDungeon.startDir,
    };
  });


  const selectMember = useCallback((index: number) => {
    setState(s => ({ ...s, activeMemberIndex: index }));
  }, []);

  const updateMember = useCallback((index: number, updates: Partial<PartyMember>) => {
    setState(s => {
      const newParty = [...s.party];
      newParty[index] = { ...newParty[index], ...updates };
      return { ...s, party: newParty };
    });
  }, []);

  // Note: Actual movement logic is in Phaser engine for now,
  // but we can sync state back or trigger it from here.
  const moveForward = useCallback(() => { /* Emit global event or direct call if available */ }, []);
  const moveBackward = useCallback(() => { /* Emit global event or direct call if available */ }, []);
  const turnLeft = useCallback(() => { /* Emit global event or direct call if available */ }, []);
  const turnRight = useCallback(() => { /* Emit global event or direct call if available */ }, []);

  const updatePosition = useCallback((pos: Position) => {
    setState(s => ({ ...s, playerPosition: pos }));
  }, []);

  const updateDirection = useCallback((dir: Direction) => {
    setState(s => ({ ...s, playerDirection: dir }));
  }, []);

  return (
    <GameContext.Provider value={{ state, moveForward, moveBackward, turnLeft, turnRight, selectMember, updateMember, updatePosition, updateDirection }}>
      {children}
    </GameContext.Provider>
  );
};


export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
