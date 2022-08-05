/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

import defaultSettings from './default-settings';

import { Controls } from './controls.model';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { isNonEmptyArrayOfStrings } from '../shared/utils';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { ShellDamageUnits, ShellSpeedUnits, TankArmorUnits, TankSpeedUnits, Units } from './units.model';
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
  private _isPlayerActive: boolean;
  private readonly _tank: Tank;
  private readonly _units: Units;
  private readonly _world: World;

  constructor() {
    this._controls = defaultSettings.controls;
    this._fps = defaultSettings.fps;
    this._interval = defaultSettings.interval;
    this._isDebugMode = false;
    this._isPlayerActive = false;
    this._tank = defaultSettings.tank;
    this._units = defaultSettings.units;
    this._world = defaultSettings.world;
  }

  get controls(): Controls {
    return this._controls;
  }

  set controls(controls: unknown) {
    const down: string[] | undefined = (controls as Controls)?.down;
    if (isNonEmptyArrayOfStrings(down)) {
      this._controls.down = down;
    }

    const fire: string[] | undefined = (controls as Controls)?.fire;
    if (isNonEmptyArrayOfStrings(fire)) {
      this._controls.fire = fire;
    }

    const left: string[] | undefined = (controls as Controls)?.left;
    if (isNonEmptyArrayOfStrings(left)) {
      this._controls.left = left;
    }

    const pause: string[] | undefined = (controls as Controls)?.pause;
    if (isNonEmptyArrayOfStrings(pause)) {
      this._controls.pause = pause;
    }

    const playerDisconnect : string[] | undefined = (controls as Controls)?.playerDisconnect;
    if (isNonEmptyArrayOfStrings(playerDisconnect)) {
      this._controls.playerDisconnect = playerDisconnect;
    }

    const right: string[] | undefined = (controls as Controls)?.right;
    if (isNonEmptyArrayOfStrings(right)) {
      this._controls.right = right;
    }

    const turbo: string[] | undefined = (controls as Controls)?.turbo;
    if (isNonEmptyArrayOfStrings(turbo)) {
      this._controls.turbo = turbo;
    }

    const up: string[] | undefined = (controls as Controls)?.up;
    if (isNonEmptyArrayOfStrings(up)) {
      this._controls.up = up;
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

  get isPlayerActive(): boolean {
    return this._isPlayerActive;
  }

  set isPlayerActive(isPlayerActive: unknown) {
    if (typeof isPlayerActive === 'boolean') {
      this._isPlayerActive = isPlayerActive;
    }
  }

  get millisecondsPerFrame(): number {
    return 1000 / this.fps;
  }

  get squareSize(): number {
    return this._world.size / this._world.squaresPerSide;
  }

  get tank(): Tank {
    return this._tank;
  }

  set tank(tank: unknown) {
    /*if ([1, 2, 3].includes(tank.armor)) { // todo: наверное не нужно, для этого есть тип танка
      this._tank.armor = tank.armor;
    }*/

    const color: string | undefined = (tank as Tank)?.color?.toUpperCase();
    if (color && Object.values(TankColorEnum).includes(color as TankColorEnum)) {
      this._tank.color = color as TankColorEnum;
      this._tank.gunColor = color as TankColorEnum;
      this._tank.hullColor = color as TankColorEnum;
    }

    const explosionType: string | undefined = (tank as Tank)?.explosionType?.toUpperCase();
    if (explosionType && Object.values(ExplosionTypeEnum).includes(explosionType as ExplosionTypeEnum)) {
      this._tank.explosionType = explosionType as ExplosionTypeEnum;
    }

    const flashType: string | undefined = (tank as Tank)?.flashType?.toUpperCase();
    if (flashType && Object.values(FlashTypeEnum).includes(flashType as FlashTypeEnum)) {
      this._tank.flashType = flashType as FlashTypeEnum;
    }

    const gunType: GunTypeEnum | undefined = (tank as Tank)?.gunType;
    if (gunType in GunTypeEnum) {
      this._tank.gunType = gunType;
    }

    const hullType: HullTypeEnum | undefined = (tank as Tank)?.hullType;
    if (hullType in HullTypeEnum) {
      this._tank.hullType = hullType;
    }

    const shellType: string | undefined = (tank as Tank)?.shellType?.toUpperCase();
    if (shellType && Object.values(ShellTypeEnum).includes(shellType as ShellTypeEnum)) {
      this._tank.shellType = shellType as ShellTypeEnum;
    }

    const shellImpactType: string | undefined = (tank as Tank)?.shellImpactType?.toUpperCase();
    if (shellImpactType && Object.values(ShellImpactTypeEnum).includes(shellImpactType as ShellImpactTypeEnum)) {
      this._tank.shellImpactType = shellImpactType as ShellImpactTypeEnum;
    }

    const shellSpeed: number | undefined = (tank as Tank)?.shellSpeed;
    if (shellSpeed > 0) {
      this._tank.shellSpeed = shellSpeed;
    }

    const speed: number | undefined = (tank as Tank)?.speed;
    if (speed > 0 && speed <= 2) {
      this._tank.speed = speed;
    }

    const trackType: TrackTypeEnum | undefined = (tank as Tank)?.trackType;
    if (trackType in TrackTypeEnum) {
      this._tank.trackType = trackType;
    }

    const turretType: TurretTypeEnum | undefined = (tank as Tank)?.turretType;
    if (turretType in TurretTypeEnum) {
      this._tank.turretType = turretType;
    }

    const turboMultiplier: number | undefined = (tank as Tank)?.turboMultiplier;
    if (turboMultiplier > 0 && turboMultiplier <= 10) {
      this._tank.turboMultiplier = turboMultiplier;
    }

    // todo: тип танка должен определяться по типу корпуса. сделать выше и закомментировать это
    const type: string | undefined = (tank as Tank)?.type?.toUpperCase();
    if (type && Object.values(TankTypeEnum).includes(type as TankTypeEnum)) {
      this._tank.type = type as TankTypeEnum;
    }
  }

  get units(): Units {
    return this._units;
  }

  set units(units: unknown) {
    const shellDamage: ShellDamageUnits | undefined = (units as Units)?.shellDamage;
    if (shellDamage) {
      Object.values(ShellTypeEnum).forEach((type) => {
        if (typeof shellDamage[type] === 'number') {
          this._units.shellDamage[type] = shellDamage[type];
        }
      });
    }

    const shellSpeed: ShellSpeedUnits | undefined = (units as Units)?.shellSpeed;
    if (shellSpeed) {
      Object.values(ShellTypeEnum).forEach((type) => {
        if (typeof shellSpeed[type] === 'number') {
          this._units.shellSpeed[type] = shellSpeed[type];
        }
      });
    }

    const tankArmor: TankArmorUnits | undefined = (units as Units)?.tankArmor;
    if (tankArmor) {
      Object.values(TankTypeEnum).forEach((type) => {
        if (typeof tankArmor[type] === 'number') {
          this._units.tankArmor[type] = tankArmor[type];
        }
      });
    }

    const tankSpeed: TankSpeedUnits | undefined = (units as Units)?.tankSpeed;
    if (tankSpeed) {
      Object.values(TankTypeEnum).forEach((type) => {
        if (typeof tankSpeed[type] === 'number') {
          this._units.tankSpeed[type] = tankSpeed[type];
        }
      });
    }
  }

  get world(): World {
    return this._world;
  }

  set world(world: unknown) {
    const isAssetsRandomRotationEnabled: boolean | undefined = (world as World)?.isAssetsRandomRotationEnabled;
    if (typeof isAssetsRandomRotationEnabled === 'boolean') {
      this._world.isAssetsRandomRotationEnabled = isAssetsRandomRotationEnabled;
    }

    const isFullyDestroyableTanks: boolean | undefined = (world as World)?.isFullyDestroyableTanks;
    if (typeof isFullyDestroyableTanks === 'boolean') {
      this._world.isFullyDestroyableTanks = isFullyDestroyableTanks;
    }

    const collisionExplosionType: string | undefined = (world as World)?.collisionExplosionType?.toUpperCase();
    if (collisionExplosionType &&
      ![ExplosionTypeEnum.A, ExplosionTypeEnum.B, ExplosionTypeEnum.C].includes(collisionExplosionType as ExplosionTypeEnum)
    ) {
      this._world.collisionExplosionType = collisionExplosionType as ExplosionTypeEnum;
    }

    const resetTimeout: number | undefined = (world as World)?.resetTimeout;
    if (typeof resetTimeout === 'number') {
      this._world.resetTimeout = resetTimeout;
    }

    const size: number | undefined = (world as World)?.size;
    if (typeof size === 'number') {
      this._world.size = size;
    }

    const showBlastTrail: boolean | undefined = (world as World)?.showBlastTrail;
    if (typeof showBlastTrail === 'boolean') {
      this._world.showBlastTrail = showBlastTrail;
    }

    const squaresPerSide: number | undefined = (world as World)?.squaresPerSide;
    if (typeof squaresPerSide === 'number') {
      this._world.squaresPerSide = squaresPerSide;
    }

    const startTimeout: number | undefined = (world as World)?.startTimeout;
    if (typeof startTimeout === 'number') {
      this._world.startTimeout = startTimeout;
    }

    const type: string | undefined = (world as World)?.type?.toUpperCase();
    if (type && Object.values(WorldTypeEnum).includes(type as WorldTypeEnum)) {
      this._world.type = type as WorldTypeEnum;
    }
  }

  // За единицу скорости принято количество миллисекунд в одном кадре.
  // Т.е. при 30 кадрах в секунду скорость 1 будет преобразована в 1/30 = 0.033.
  convertSpeed(speed = 1): number {
    return 1 / this._fps * speed;
  }
}
