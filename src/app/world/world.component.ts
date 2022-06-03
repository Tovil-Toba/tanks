import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ControlsService } from '../core/controls.service';
import { DirectionEnum } from '../shared/direction.enum';
import { ExplosionTypeEnum } from './explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { randomIntFromInterval } from '../shared/utils';
import { SettingsService } from '../core/settings.service';
import { ShellImpactWithTank } from './shared/shell-impact-with-tank';
import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { ShellImpactTypeEnum } from '../tank/shell/shell-impact/shell-impact-type.enum';
import { TankColorEnum } from '../tank/tank-color.enum';
import { TankIndex } from '../tank/tank-index.model';
import * as TickActions from '../store/tick.actions';
import { TrackTypeEnum } from '../tank/track/track-type.enum';
import { TurretTypeEnum } from '../tank/turret/turret-type.enum';
import { WorldService } from './world.service';
import { WorldTypeEnum } from './world-type.enum';
import { WORLD_COLORS } from './world-colors';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnChanges, OnDestroy, OnInit {
  @Input() size!: number;
  @Input() type: WorldTypeEnum;

  directionControls: Array<DirectionEnum | undefined>;
  readonly explosionType: ExplosionTypeEnum;
  readonly flashType: FlashTypeEnum;
  readonly gunType: GunTypeEnum;
  readonly hullType: HullTypeEnum;
  isFireControls: Array<boolean | undefined>;
  isTurboControls: Array<boolean | undefined>;
  playerTankIndex: TankIndex;
  readonly shellType: ShellTypeEnum;
  readonly shellImpactType: ShellImpactTypeEnum;
  readonly speed: number;
  readonly tankColors: Array<TankColorEnum>;
  readonly tankIndexes: Array<TankIndex>;
  readonly turboMultiplier: number;
  readonly turretType: TurretTypeEnum;
  readonly trackType: TrackTypeEnum;

  tick$: Observable<number>;

  private readonly subscription: Subscription;

  constructor(
    private controls: ControlsService,
    public settings: SettingsService,
    private readonly store: Store,
    public worldService: WorldService
  ) {
    this.directionControls = new Array<DirectionEnum | undefined>(4);
    this.explosionType = settings.tank.explosionType;
    this.flashType = settings.tank.flashType;
    this.gunType = settings.tank.gunType;
    this.hullType = settings.tank.hullType;
    this.isFireControls = new Array<boolean | undefined>(4);
    this.isTurboControls = new Array<boolean | undefined>(4);
    this.playerTankIndex = randomIntFromInterval(0, 3) as TankIndex;
    this.shellType = settings.tank.shellType;
    this.shellImpactType = settings.tank.shellImpactType;
    this.size = settings.world.size;
    this.speed = settings.tank.speed;
    this.tankColors = [
      TankColorEnum.A,
      TankColorEnum.B,
      TankColorEnum.C,
      TankColorEnum.D
    ];
    this.tankIndexes = [0, 1, 2, 3];
    this.turboMultiplier = settings.tank.turboMultiplier;
    this.turretType = settings.tank.turretType;
    this.trackType = settings.tank.trackType;
    const millisecondsPerFrame = 1000 / settings.fps; // todo: можно инициализировать интервал настроек тут

    if (settings.isDebugMode) {
      console.log('Milliseconds in 1 frame', millisecondsPerFrame);
    }

    this.tick$ = interval(millisecondsPerFrame);
    this.type = WorldTypeEnum.A;
    // todo: сделать рандомную генерацию 4 танков
    this.subscription = new Subscription();
  }

  get backgroundColor(): string {
    return WORLD_COLORS[this.type];
  }

  get squareSize(): number {
    return this.size / this.settings.world.squaresPerSide;
  }

  /*get shellImpactTanksIndexes(): Array<TankIndex> {
    return this.worldService.shellImpactTanksIndexes;
  }*/

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.controls.isDirectionButton(event)) {
      if (this.controls.isDownButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Down;
      } else if (this.controls.isLeftButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Left;
      } else if (this.controls.isRightButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Right;
      } else if (this.controls.isUpButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Up;
      }
    } else if (this.controls.isFireButton(event)) {
      this.isFireControls[this.playerTankIndex] = true;
    } else if (this.controls.isTurboButton(event)) {
      this.isTurboControls[this.playerTankIndex] = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (this.controls.isDirectionButton(event)) {
      this.directionControls[this.playerTankIndex] = undefined;
    } else if (this.controls.isFireButton(event)) {
      this.isFireControls[this.playerTankIndex] = false;
    } else if (this.controls.isTurboButton(event)) {
      this.isTurboControls[this.playerTankIndex] = false;
    }
  }

  getShellsImpactByTankIndex(tankIndex: TankIndex): Array<ShellImpactWithTank> {
    return this.worldService.getShellsImpactByTankIndex(tankIndex);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']?.currentValue !== changes['size']?.previousValue) {
      this.settings.world.size = this.size;
      this.worldService.recalculateSquareSizes(this.squareSize);
      this.worldService.recalculateTanksCoordinates(
        changes['size']?.currentValue as number,
        changes['size']?.previousValue as number
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.worldService.initSquares(this.squareSize);
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe(() => {
        this.store.dispatch(TickActions.increment());
      })
    );
  }
}
