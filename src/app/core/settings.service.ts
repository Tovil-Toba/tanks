import { Injectable } from '@angular/core';

import defaultSettings from './default-settings';

import { Controls } from './controls.model';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { isNonEmptyArrayOfStrings } from '../shared/utils';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { ShellImpactTypeEnum } from '../tank/shell/shell-impact/shell-impact-type.enum';
import { Tank } from '../tank/tank.model';
import { TankColorEnum } from '../tank/tank-color.enum';
import { TankTypeEnum } from '../tank/tank-type';
import { TrackTypeEnum } from '../tank/track/track-type.enum';
import { TurretTypeEnum } from '../tank/turret/turret-type.enum';
import { World } from '../world/world.model';
import { WorldTypeEnum } from '../world/world-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly _controls: Controls;
  private _fps: number;
  private _interval: number;
  private _isDebugMode: boolean;
  private readonly _tank: Tank;
  private readonly _world: World;

  constructor() {
    this._controls = defaultSettings.controls;
    this._fps = defaultSettings.fps;
    this._interval = defaultSettings.interval;
    this._isDebugMode = false;
    this._tank = defaultSettings.tank;
    this._world = defaultSettings.world;
  }

  get controls(): Controls {
    return this._controls;
  }

  set controls(controls: any) {
    if (isNonEmptyArrayOfStrings(controls.down)) {
      this._controls.down = controls.down;
    }

    if (isNonEmptyArrayOfStrings(controls.fire)) {
      this._controls.fire = controls.fire;
    }

    if (isNonEmptyArrayOfStrings(controls.left)) {
      this._controls.left = controls.left;
    }

    if (isNonEmptyArrayOfStrings(controls.right)) {
      this._controls.right = controls.right;
    }

    if (isNonEmptyArrayOfStrings(controls.turbo)) {
      this._controls.turbo = controls.turbo;
    }

    if (isNonEmptyArrayOfStrings(controls.up)) {
      this._controls.up = controls.up;
    }
  }

  get fps(): number {
    return this._fps;
  }

  set fps(fps: unknown) {
    if (typeof fps === 'number' && fps > 0 && fps <= 60) {
      this._fps = fps;
    }
  }

  get interval(): number {
    return this._interval;
  }

  set interval(interval: unknown) {
    if (typeof interval === 'number' && interval > 0 && interval <= 1000) {
      this._interval = interval;
    }
  }

  get isDebugMode(): boolean {
    return this._isDebugMode;
  }

  set isDebugMode(isDebugMode: unknown) {
    if (typeof isDebugMode === 'boolean') {
      this._isDebugMode = isDebugMode;
    }
  }

  get squareSize(): number {
    return this._world.size / this._world.squaresPerSide;
  }

  get tank(): Tank {
    return this._tank;
  }

  set tank(tank: any) {
    /*if ([1, 2, 3].includes(tank.armor)) { // todo: наверное не нужно, для этого есть тип танка
      this._tank.armor = tank.armor;
    }*/

    if (tank.color in TankColorEnum) {
      this._tank.color = tank.color;
      this._tank.gunColor = tank.color;
      this._tank.hullColor = tank.hullColor;
    }

    if (tank.explosionType in ExplosionTypeEnum) {
      this._tank.explosionType = tank.explosionType;
    }

    if (tank.flashType in FlashTypeEnum) {
      this._tank.flashType = tank.flashType;
    }

    if (tank.gunType in GunTypeEnum) {
      this._tank.gunType = tank.gunType;
    }

    if (tank.hullType in HullTypeEnum) {
      this._tank.hullType = tank.hullType;
    }

    const shellType = tank.shellType.toUpperCase();
    if (Object.values(ShellTypeEnum).includes(shellType)) {
      this._tank.shellType = shellType;
    }

    const shellImpactType = tank.shellImpactType.toUpperCase();
    if (Object.values(ShellImpactTypeEnum).includes(shellImpactType)) {
      this._tank.shellImpactType = shellImpactType;
    }

    if (typeof tank.shellSpeed === 'number' && tank.shellSpeed > 0) {
      this._tank.shellSpeed = tank.shellSpeed;
    }

    if (typeof tank.speed === 'number' && tank.speed > 0 && tank.speed <= 2) {
      this._tank.speed = tank.speed;
    }

    if (tank.trackType in TrackTypeEnum) {
      this._tank.trackType = tank.trackType;
    }

    if (tank.turretType in TurretTypeEnum) {
      this._tank.turretType = tank.turretType;
    }

    const turboMultiplier = +tank.turboMultiplier;
    if (turboMultiplier > 0 && turboMultiplier <= 10) {
      this._tank.turboMultiplier = tank.turboMultiplier;
    }

    // todo: тип танка должен определяться по типу корпуса. сделать выше и закомментировать это
    const type = tank.type.toUpperCase();
    if (Object.values(TankTypeEnum).includes(type)) {
      this._tank.type = type;
    }
  }

  get world(): World {
    return this._world;
  }

  set world(world: any) {
    if (typeof world.isAssetsRandomRotationEnabled === 'boolean') {
      this._world.isAssetsRandomRotationEnabled = world.isAssetsRandomRotationEnabled;
    }

    if (world.collisionExplosionType in ExplosionTypeEnum &&
      ![ExplosionTypeEnum.A, ExplosionTypeEnum.B, ExplosionTypeEnum.C].includes(world.collisionExplosionType)
    ) {
      this._world.collisionExplosionType = world.collisionExplosionType;
    }

    if (typeof world.size === 'number') {
      this._world.size = world.size;
    }

    if (typeof world.showBlastTrail === 'boolean') {
      this._world.showBlastTrail = world.showBlastTrail;
    }

    if (typeof world.squaresPerSide === 'number') {
      this._world.squaresPerSide = world.squaresPerSide;
    }

    if (world.type in WorldTypeEnum) {
      this._world.type = world.type;
    }
  }

  // За единицу скорости принято количество миллисекунд в одном кадре.
  // Т.е. при 30 кадрах в секунду скорость 1 будет преобразована в 1/30 = 0.033.
  convertSpeed(speed = 1): number {
    return 1 / this._fps * speed;
  }
}
