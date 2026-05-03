export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: 'player' | 'enemy' | 'npc';
  name: string;
  stats: Stats;
  position: Position;
  direction: Direction;
}

export interface Stats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number;
  def: number;
  level: number;
  xp: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key';
  effect?: Partial<Stats>;
}

export interface PartyMember extends Entity {
  class: 'Warrior' | 'Mage' | 'Rogue' | 'Cleric';
  inventory: Array<Item | null>;
  equipped: {
    weapon: Item | null;
    armor: Item | null;
  };
}

export type TileType = 'wall' | 'floor' | 'door' | 'stairs_up' | 'stairs_down' | 'void';

export interface DungeonTile {
  type: TileType;
  metadata?: any;
}

export interface DungeonLevel {
  id: string;
  name: string;
  width: number;
  height: number;
  grid: TileType[][];
  enemies: Array<{ type: string; pos: Position }>;
  items: Array<{ type: string; pos: Position }>;
  startPos: Position;
  startDir: Direction;
}

export interface GameState {
  party: PartyMember[];
  activeMemberIndex: number;
  currentLevelId: string;
  dungeons: Record<string, DungeonLevel>;
  playerPosition: Position;
  playerDirection: Direction;
}
