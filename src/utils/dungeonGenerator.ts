import { DungeonLevel, TileType, Direction, Position } from '../types';

export function createEmptyDungeon(width: number, height: number): DungeonLevel {
  const grid: TileType[][] = [];
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      // Create a border of walls
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        row.push('wall');
      } else {
        row.push('floor');
      }
    }
    grid.push(row);
  }

  return {
    id: 'test-dungeon',
    name: 'The Echoing Void',
    width,
    height,
    grid,
    enemies: [],
    items: [],
    startPos: { x: 1, y: 1 },
    startDir: 'E'
  };
}

export function createSampleDungeon(): DungeonLevel {
  const dungeon = createEmptyDungeon(10, 10);
  // Add some walls
  dungeon.grid[2][2] = 'wall';
  dungeon.grid[2][3] = 'wall';
  dungeon.grid[3][2] = 'wall';
  dungeon.grid[5][5] = 'wall';
  dungeon.grid[5][6] = 'wall';
  dungeon.grid[6][5] = 'wall';
  
  return dungeon;
}
