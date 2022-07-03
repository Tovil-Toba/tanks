import { Controls } from './controls.model';
import { Tank } from '../tank/tank.model';
import { Units } from './units.model';
import { World } from '../world/world.model';

export interface Settings {
  controls: Controls;
  isDebugMode: boolean;
  isPlayerActive: boolean;
  fps: number;
  interval: number;
  tank: Tank;
  units: Units;
  world: World;
}
