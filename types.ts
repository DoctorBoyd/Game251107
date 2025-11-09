
export interface GameSettings {
  shipAcceleration: number;
  shipDeceleration: number;
  shipColor: string;
  asteroidColor: string;
  masterVolume: number;
  laserVolume: number;
  thrustVolume: number;
  explosionVolume: number;
  newLevelVolume: number;
  shieldVolume: number;
  ambientVolume: number;
}

export interface Ship {
  x: number;
  y: number;
  xv: number;
  yv: number;
  angle: number;
  thrusting: boolean;
  dead: boolean;
  invincible: boolean;
  invincibleTimer: number;
  blinkOn: boolean;
  shieldsAvailable: number;
  shieldActive: boolean;
  shieldTimer: number;
}

export interface AsteroidVertex {
  x: number;
  y: number;
}

export type AsteroidSize = 'large' | 'medium' | 'small';

export interface Asteroid {
  x: number;
  y: number;
  xv: number;
  yv: number;
  radius: number;
  angle: number;
  rotationSpeed: number;
  vertices: AsteroidVertex[];
  size: AsteroidSize;
}

export interface Laser {
  x: number;
  y: number;
  xv: number;
  yv: number;
  life: number;
}

export interface ScoreEntry {
    name: string;
    score: number;
}