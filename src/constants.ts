import { Direction, Position } from './types';

export const GRID_SIZE = 64;
export const VIEW_DISTANCE = 4;

export const DIRECTIONS: Record<Direction, Position> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

export const ROTATIONS: Record<Direction, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

export const TURN_LEFT: Record<Direction, Direction> = {
  N: 'W',
  W: 'S',
  S: 'E',
  E: 'N',
};

export const TURN_RIGHT: Record<Direction, Direction> = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
};

export const INITIAL_PARTY_SIZE = 4;

export const DEFAULT_DUNGEON_WIDTH = 20;
export const DEFAULT_DUNGEON_HEIGHT = 20;
