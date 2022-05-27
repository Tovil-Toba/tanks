import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ExplosionTypeEnum } from './explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { SettingsService } from '../core/settings.service';
import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { ShellImpactTypeEnum } from '../tank/shell/shell-impact/shell-impact-type.enum';
import { TankColorEnum } from '../tank/tank-color.enum';
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

  readonly explosionType: ExplosionTypeEnum;
  readonly flashType: FlashTypeEnum;
  readonly gunType: GunTypeEnum;
  readonly hullType: HullTypeEnum;
  readonly shellType: ShellTypeEnum;
  readonly shellImpactType: ShellImpactTypeEnum;
  readonly speed: number;
  readonly tankColor: TankColorEnum;
  readonly turboMultiplier: number;
  readonly turretType: TurretTypeEnum;
  readonly trackType: TrackTypeEnum;

  tick$: Observable<number>;

  private readonly subscription: Subscription;

  get backgroundColor(): string {
    return WORLD_COLORS[this.type];
  }

  get squareSize(): number {
    return this.size / this.settings.world.squaresPerSide;
  }

  constructor(
    public settings: SettingsService,
    private readonly store: Store,
    public worldService: WorldService
  ) {
    this.explosionType = settings.tank.explosionType;
    this.flashType = settings.tank.flashType;
    this.gunType = settings.tank.gunType;
    this.hullType = settings.tank.hullType;
    this.shellType = settings.tank.shellType;
    this.shellImpactType = settings.tank.shellImpactType;
    this.size = settings.world.size;
    this.speed = settings.tank.speed;
    this.tankColor = settings.tank.color;
    this.turboMultiplier = settings.tank.turboMultiplier;
    this.turretType = settings.tank.turretType;
    this.trackType = settings.tank.trackType;
    const millisecondsPerFrame = 1000 / this.settings.fps; // todo: можно инициализировать интервал настроек тут
    console.log('Milliseconds in 1 frame', millisecondsPerFrame);
    this.tick$ = interval(millisecondsPerFrame);
    this.type = WorldTypeEnum.A;
    // todo: сделать рандомную генерацию 4 танков
    this.subscription = new Subscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']?.currentValue !== changes['size']?.previousValue) {
      this.settings.world.size = this.size;
      this.worldService.recalculateSquareSizes(this.squareSize);
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
