import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { DungeonScene } from '../game/DungeonScene';
import { DungeonEngine } from '../game/engine/DungeonEngine';
import { useGame } from '../context/GameContext';

const PhaserGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const { state, updatePosition, updateDirection } = useGame();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const engine = new DungeonEngine(state.dungeons[state.currentLevelId]);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 480,
      backgroundColor: '#000000',
      scene: [DungeonScene],
      physics: {
        default: 'arcade',
      },
      audio: {
        noAudio: true
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Pass data to scene
    game.scene.start('DungeonScene', { engine });

    // Listen for state changes from Phaser
    game.events.on('player-moved', (pos: any) => {
      updatePosition(pos);
    });
    game.events.on('player-turned', (dir: any) => {
      updateDirection(dir);
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);


  return (
    <div className="relative border-4 border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
      <div ref={containerRef} id="phaser-game" />
    </div>
  );
};

export default PhaserGame;
