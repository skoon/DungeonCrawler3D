import Phaser from 'phaser';
import { DungeonEngine } from './engine/DungeonEngine';
import { DIRECTIONS } from '../constants';
import { Direction, Position } from '../types';

export class DungeonScene extends Phaser.Scene {
  private engine: DungeonEngine;
  private viewContainer: Phaser.GameObjects.Container;
  private walls: Phaser.GameObjects.Rectangle[] = [];
  
  constructor() {
    super('DungeonScene');
  }

  init(data: { engine: DungeonEngine }) {
    this.engine = data.engine;
  }

  preload() {
    this.createProceduralTexture('wall_tex', 0x555555, 'bricks');
    this.createProceduralTexture('floor_tex', 0x333333, 'tiles');
    this.createProceduralTexture('ceiling_tex', 0x222222, 'rough');
  }

  private createProceduralTexture(key: string, color: number, type: 'bricks' | 'tiles' | 'rough') {
    const size = 128;
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, size, size);
    
    graphics.lineStyle(2, 0x000000, 0.4);
    if (type === 'bricks') {
      for (let y = 0; y <= size; y += size/4) {
        graphics.lineBetween(0, y, size, y);
        const xOffset = (y % (size/2) === 0) ? 0 : size/8;
        for (let x = xOffset; x <= size; x += size/4) {
          graphics.lineBetween(x, y, x, y + size/4);
        }
      }
    } else if (type === 'tiles') {
      graphics.strokeRect(0, 0, size, size);
      graphics.lineBetween(0, size/2, size, size/2);
      graphics.lineBetween(size/2, 0, size/2, size);
      // Add some "cracks"
      graphics.lineStyle(1, 0x000000, 0.2);
      graphics.lineBetween(10, 10, 30, 40);
    } else {
      // Rough texture
      for (let i = 0; i < 20; i++) {
        graphics.fillStyle(0x000000, 0.1);
        graphics.fillCircle(Phaser.Math.Between(0, size), Phaser.Math.Between(0, size), Phaser.Math.Between(1, 5));
      }
    }
    
    graphics.generateTexture(key, size, size);
  }

  create() {
    const { width, height } = this.scale;
    this.viewContainer = this.add.container(width / 2, height / 2);
    
    this.renderView();

    this.input.keyboard?.on('keydown-W', () => {
      if (this.engine.moveForward()) {
        this.events.emit('player-moved', this.engine.playerPos);
        this.game.events.emit('player-moved', this.engine.playerPos);
        this.renderView();
      }
    });
    this.input.keyboard?.on('keydown-S', () => {
      if (this.engine.moveBackward()) {
        this.events.emit('player-moved', this.engine.playerPos);
        this.game.events.emit('player-moved', this.engine.playerPos);
        this.renderView();
      }
    });
    this.input.keyboard?.on('keydown-A', () => {
      this.engine.turnLeft();
      this.game.events.emit('player-turned', this.engine.playerDir);
      this.renderView();
    });
    this.input.keyboard?.on('keydown-D', () => {
      this.engine.turnRight();
      this.game.events.emit('player-turned', this.engine.playerDir);
      this.renderView();
    });
    
    // Also arrows
    this.input.keyboard?.on('keydown-UP', () => {
      if (this.engine.moveForward()) {
        this.game.events.emit('player-moved', this.engine.playerPos);
        this.renderView();
      }
    });
    this.input.keyboard?.on('keydown-DOWN', () => {
      if (this.engine.moveBackward()) {
        this.game.events.emit('player-moved', this.engine.playerPos);
        this.renderView();
      }
    });
    this.input.keyboard?.on('keydown-LEFT', () => {
      this.engine.turnLeft();
      this.game.events.emit('player-turned', this.engine.playerDir);
      this.renderView();
    });
    this.input.keyboard?.on('keydown-RIGHT', () => {
      this.engine.turnRight();
      this.game.events.emit('player-turned', this.engine.playerDir);
      this.renderView();
    });


    // Custom event for React to trigger movement
    this.events.on('move-forward', () => {
      if (this.engine.moveForward()) this.renderView();
    });
    this.events.on('move-backward', () => {
      if (this.engine.moveBackward()) this.renderView();
    });
    this.events.on('turn-left', () => {
      this.engine.turnLeft();
      this.renderView();
    });
    this.events.on('turn-right', () => {
      this.engine.turnRight();
      this.renderView();
    });
  }

  renderView() {
    this.viewContainer.removeAll(true);
    
    // Draw background (floor and ceiling) with basic perspective feel
    const floor = this.add.tileSprite(0, 100, 1200, 400, 'floor_tex').setOrigin(0.5);
    const ceiling = this.add.tileSprite(0, -200, 1200, 400, 'ceiling_tex').setOrigin(0.5);
    
    // Add a dark fog overlay to the floor/ceiling
    floor.setTint(0x444444);
    ceiling.setTint(0x333333);

    this.viewContainer.add([floor, ceiling]);

    const pos = this.engine.playerPos;
    const dir = this.engine.playerDir;
    
    // We render from back to front (distance 3 to 0)
    for (let dist = 3; dist >= 0; dist--) {
      this.renderRow(pos, dir, dist);
    }
  }

  private renderRow(playerPos: Position, dir: Direction, dist: number) {
    const forward = DIRECTIONS[dir];
    const right = DIRECTIONS[this.getRightDir(dir)];
    
    // Render 3 tiles across at this distance: left, center, right
    for (let offset = -1; offset <= 1; offset++) {
      const tileX = playerPos.x + (forward.x * dist) + (right.x * offset);
      const tileY = playerPos.y + (forward.y * dist) + (right.y * offset);
      
      const tileType = this.engine.getTileAt(tileX, tileY);
      if (tileType === 'wall' || tileType === 'door') {
        this.drawWall(dist, offset, tileType === 'door');
      }

      // Check for enemies
      const enemy = this.engine.level.enemies.find(e => e.pos.x === tileX && e.pos.y === tileY);
      if (enemy && offset === 0) { // only show enemy if in front
        this.drawEnemy(dist);
      }
    }
  }

  private drawEnemy(dist: number) {
    const scale = 1 / (dist + 1);
    const size = 100 * scale;
    const y = 0;
    
    const sprite = this.add.star(0, y, 5, size / 2, size, 0xff0000);
    this.viewContainer.add(sprite);
  }


  private drawWall(dist: number, offset: number, isDoor: boolean = false) {
    // Simple projection logic
    const baseWidth = 400;
    const baseHeight = 400;
    const scale = 1 / (dist + 1);
    
    const w = baseWidth * scale;
    const h = baseHeight * scale;
    const x = offset * w;
    const y = 0; // centered vertically

    // Create the wall sprite
    const wall = this.add.tileSprite(x, y, w, h, 'wall_tex');
    wall.setTileScale(scale * 1.5);
    wall.setOrigin(0.5);
    
    // Depth-based shading (fog/darkness)
    const darkness = Math.max(0, 1 - (dist * 0.25));
    let baseColor = 255 * darkness;
    
    if (isDoor) {
        wall.setTint(Phaser.Display.Color.GetColor(baseColor, baseColor * 0.6, baseColor * 0.2));
    } else {
        wall.setTint(Phaser.Display.Color.GetColor(baseColor, baseColor, baseColor));
    }

    // Outline
    const graphics = this.add.graphics();
    graphics.lineStyle(2 / (dist + 1), 0x000000, 1);
    graphics.strokeRect(x - w / 2, y - h / 2, w, h);

    this.viewContainer.add([wall, graphics]);
  }

  private getRightDir(dir: Direction): Direction {
    if (dir === 'N') return 'E';
    if (dir === 'E') return 'S';
    if (dir === 'S') return 'W';
    return 'N';
  }
}
