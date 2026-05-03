import { Direction, Position, TileType, DungeonLevel } from '../../types';
import { DIRECTIONS, TURN_LEFT, TURN_RIGHT } from '../../constants';

export class DungeonEngine {
  public level: DungeonLevel;
  public playerPos: Position;
  public playerDir: Direction;

  constructor(level: DungeonLevel) {
    this.level = level;
    this.playerPos = { ...level.startPos };
    this.playerDir = level.startDir;
  }

  public moveForward(): boolean {
    const delta = DIRECTIONS[this.playerDir];
    const newPos = { x: this.playerPos.x + delta.x, y: this.playerPos.y + delta.y };
    if (this.isValidMove(newPos)) {
      this.playerPos = newPos;
      return true;
    }
    return false;
  }

  public moveBackward(): boolean {
    const delta = DIRECTIONS[this.playerDir];
    const newPos = { x: this.playerPos.x - delta.x, y: this.playerPos.y - delta.y };
    if (this.isValidMove(newPos)) {
      this.playerPos = newPos;
      return true;
    }
    return false;
  }

  public turnLeft() {
    this.playerDir = TURN_LEFT[this.playerDir];
  }

  public turnRight() {
    this.playerDir = TURN_RIGHT[this.playerDir];
  }

  private isValidMove(pos: Position): boolean {
    if (pos.x < 0 || pos.x >= this.level.width || pos.y < 0 || pos.y >= this.level.height) {
      return false;
    }
    const tile = this.level.grid[pos.y][pos.x];
    return tile === 'floor' || tile === 'stairs_up' || tile === 'stairs_down' || tile === 'door';
  }

  public getTileAt(x: number, y: number): TileType {
    if (x < 0 || x >= this.level.width || y < 0 || y >= this.level.height) {
      return 'void';
    }
    return this.level.grid[y][x];
  }
}
