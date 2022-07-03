import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ControlsService } from '../core/controls.service';
import { DirectionEnum } from '../shared/direction.enum';
import { randomIntFromInterval } from '../shared/utils';
import { selectWorldNumber } from '../store/world-number.selectors';
import { SettingsService } from '../core/settings.service';
import { ShellImpactWithTank } from './shared/shell-impact-with-tank';
import { Tank } from '../tank/tank.model';
import { TankColorEnum } from '../tank/tank-color.enum';
import { TankIndex, TANKS_INDEXES } from '../tank/tank-index.model';
import { TankMovementService } from '../core/tank-movement.service';
import { TankNumber } from '../core/tanks-roster.model';
import { TANKS_ROSTER } from '../core/tanks-roster';
import * as TickActions from '../store/tick.actions';
import { WORLD_COLORS } from './world-colors';
import * as WorldNumberActions from '../store/world-number.actions';
import { WorldService } from './world.service';
import { WorldTypeEnum } from './world-type.enum';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],
  providers: [TankMovementService, WorldService]
})
export class WorldComponent implements OnChanges, OnDestroy, OnInit {
  @Input() size!: number;
  @Input() type: WorldTypeEnum;

  @Output() readonly resetWorld: EventEmitter<void>;

  directionControls: Record<TankIndex, DirectionEnum | undefined>;
  isFireControls: Array<boolean | undefined>;
  isInfoVisible?: boolean;
  isStartTimerActive?: boolean;
  isTurboControls: Array<boolean | undefined>;
  startTimerText?: string;
  readonly tanks: Record<TankIndex, Tank>;
  readonly tankColors: Array<TankColorEnum>;
  readonly tankIndexes: Array<TankIndex>;

  tick$: Observable<number>;
  worldNumber$: Observable<number>;

  private readonly subscription: Subscription;

  constructor(
    private controlsService: ControlsService,
    public settings: SettingsService,
    private store: Store,
    public tankMovementService: TankMovementService,
    public worldService: WorldService
  ) {
    this.directionControls = tankMovementService.directionControls;
    this.isFireControls = new Array<boolean | undefined>(4);
    this.isTurboControls = new Array<boolean | undefined>(4);
    this.isStartTimerActive = true;
    // this.millisecondsPerFrame = 1000 / settings.fps;
    this.resetWorld = new EventEmitter<void>();
    this.size = settings.world.size;
    this.subscription = new Subscription();
    this.tanks = {
      0: TANKS_ROSTER[randomIntFromInterval(1, 8) as TankNumber],
      1: TANKS_ROSTER[randomIntFromInterval(1, 8) as TankNumber],
      2: TANKS_ROSTER[randomIntFromInterval(1, 8) as TankNumber],
      3: TANKS_ROSTER[randomIntFromInterval(1, 8) as TankNumber],
    };
    worldService.tankArmors = {
      0: settings.units.tankArmor[this.tanks[0].type],
      1: settings.units.tankArmor[this.tanks[1].type],
      2: settings.units.tankArmor[this.tanks[2].type],
      3: settings.units.tankArmor[this.tanks[3].type],
    };
    this.tankColors = [
      TankColorEnum.A,
      TankColorEnum.B,
      TankColorEnum.C,
      TankColorEnum.D
    ];
    this.tankIndexes = [0, 1, 2, 3];

    if (settings.isDebugMode) {
      console.log('Milliseconds in 1 frame', settings.millisecondsPerFrame);
    }

    this.tick$ = interval(settings.millisecondsPerFrame);
    this.type = WorldTypeEnum.A;
    this.worldNumber$ = store.select(selectWorldNumber);
  }

  get backgroundColor(): string {
    return WORLD_COLORS[this.type];
  }

  get squareSize(): number {
    return this.size / this.settings.world.squaresPerSide;
  }

  private get playerTankIndex(): TankIndex | undefined {
    return this.tankMovementService.playerTankIndex;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.playerTankIndex === undefined ||
      this.worldService.isTankDestroyed(this.playerTankIndex) ||
      this.worldService.isPauseActive
    ) {
      return;
    }

    if (this.controlsService.isDirectionButton(event)) {
      if (this.controlsService.isDownButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Down;
      } else if (this.controlsService.isLeftButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Left;
      } else if (this.controlsService.isRightButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Right;
      } else if (this.controlsService.isUpButton(event)) {
        this.directionControls[this.playerTankIndex] = DirectionEnum.Up;
      }
    } else if (this.controlsService.isFireButton(event)) {
      this.isFireControls[this.playerTankIndex] = true;
    } else if (this.controlsService.isTurboButton(event)) {
      this.isTurboControls[this.playerTankIndex] = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (this.controlsService.isPlayerDisconnectButton(event)) {
      this.disconnectPlayer();
    }

    if (this.controlsService.isPauseButton(event)) {
      this.worldService.isPauseActive = !this.worldService.isPauseActive;
      this.worldService.isPauseMaskActive = this.worldService.isPauseActive;
    }

    /*if (this.worldService.isPauseMaskActive) {
      return;
    }*/

    if (!this.settings.isPlayerActive && this.controlsService.isFireButton(event)) {
      this.initPlayer();
    }

    if (this.playerTankIndex === undefined ||
      this.worldService.isTankDestroyed(this.playerTankIndex)
    ) {
      return;
    }

    if (this.controlsService.isDirectionButton(event)) {
      this.directionControls[this.playerTankIndex] = undefined;
    } else if (this.controlsService.isFireButton(event)) {
      this.isFireControls[this.playerTankIndex] = false;
    } else if (this.controlsService.isTurboButton(event)) {
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
      this.tankMovementService.recalculateTanksCoordinates(
        changes['size']?.currentValue as number,
        changes['size']?.previousValue as number
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(WorldNumberActions.increment());
    this.worldService.initSquares(this.squareSize);

    let isDirectionControlsInitialized = false;
    let isWorldResetStarted = false;
    const worldStartTimeout = this.settings.world.startTimeout;
    const worldResetTimeout = this.settings.world.resetTimeout;

    let countdown = 3;
    let timer = 0;

    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        if (this.worldService.isPauseActive || this.worldService.isPauseMaskActive) {
          return;
        }

        if (tick % this.settings.fps === 0) {
          timer++;
          // console.log(timer);

          this.isInfoVisible = !this.isInfoVisible;

          if ((timer > worldStartTimeout - countdown - 2) &&
            (timer < worldStartTimeout - countdown)
          ) {
            this.startTimerText = ' ';
          } else if (timer >= worldStartTimeout - countdown) {
            this.startTimerText = countdown ? countdown.toString() : 'Бой!';
            countdown--;
          }
        }

        this.isStartTimerActive = !this.worldService.isPauseMaskActive && timer <= worldStartTimeout;

        if (this.isStartTimerActive) {
          return;
        }

        if (!isDirectionControlsInitialized) {
          this.tankMovementService.initDirectionControls(this.playerTankIndex);
          isDirectionControlsInitialized = true;
        }

        this.store.dispatch(TickActions.increment());

        if (worldResetTimeout > 0 &&
          !isWorldResetStarted &&
          this.worldService.destroyedTankIndexes.size >= TANKS_INDEXES.length - 1 &&
          !this.worldService.isPauseActive
        ) {
          isWorldResetStarted = true;

          const timeoutId = setTimeout(() => {
            if (!this.worldService.isPauseActive) {
              this.resetWorld.emit();
            }

            clearTimeout(timeoutId);
          }, worldResetTimeout * 1000);
        }
      })
    );
  }

  private disconnectPlayer(): void {
    this.settings.isPlayerActive = false;

    if (this.playerTankIndex !== undefined) {
      this.directionControls[this.playerTankIndex] = this.tankMovementService.randomDirection;
      this.isFireControls[this.playerTankIndex] = false;
      this.isTurboControls[this.playerTankIndex] = false;
      this.tankMovementService.playerTankIndex = undefined;
    }
  }

  private initPlayer(): void {
    this.settings.isPlayerActive = true;

    while (!this.playerTankIndex) {
      const randomTankIndex = randomIntFromInterval(0, 3) as TankIndex;

      if (!this.worldService.isTankDestroyed(randomTankIndex)) {
        this.tankMovementService.playerTankIndex = randomTankIndex;
      }
    }

    this.directionControls[this.playerTankIndex] = undefined;
    this.isFireControls[this.playerTankIndex] = false;
    this.isTurboControls[this.playerTankIndex] = false;
  }
}
