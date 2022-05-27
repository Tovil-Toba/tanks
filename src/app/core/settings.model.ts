import { Controls } from './controls.model';
import { Tank } from '../tank/tank.model';
import { World } from '../world/world.model';

export interface Settings {
  controls: Controls;
  isDebugMode: boolean;
  fps: number;
  interval: number;
  tank: Tank;
  world: World;
}
