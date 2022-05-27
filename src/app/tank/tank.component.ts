import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { DirectionEnum } from '../shared/direction.enum';
import {
  downLeft,
  downRight,
  downUp,
  leftDown,
  leftRight,
  leftUp,
  rightDown,
  rightLeft,
  rightUp,
  upDown,
  upLeft,
  upRight
} from '../shared/rotate';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from './flash/flash-type.enum';
import { GunTypeEnum } from './gun/gun-type.enum';
import { HullTypeEnum } from './hull/hull-type.enum';
import { selectTick } from '../store/tick.selectors';
import { SettingsService } from '../core/settings.service';
import { ShellTypeEnum } from './shell/shell-type.enum';
import { ShellImpactTypeEnum } from './shell/shell-impact/shell-impact-type.enum';
import { Square } from '../world/square/square.model';
import { SquareTypeEnum } from '../world/square/square-type.enum';
import { TankColorEnum } from './tank-color.enum';
import { TrackTypeEnum } from './track/track-type.enum';
import { TurretTypeEnum } from './turret/turret-type.enum';
import { WorldService } from '../world/world.service';

@Component({
  selector: 'app-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.scss']
})
export class TankComponent implements OnChanges, OnDestroy, OnInit {
  @Input() armor?;
  @Input() color?: TankColorEnum;
  @Input() explosionType?: ExplosionTypeEnum;
  @Input() flashType?: FlashTypeEnum;
  @Input() gunColor?: TankColorEnum;
  @Input() gunType?: GunTypeEnum;
  @Input() hullColor?: TankColorEnum;
  @Input() hullType?: HullTypeEnum;
  @Input() name?: string;
  @Input() shellType?: ShellTypeEnum;
  @Input() shellImpactType?: ShellImpactTypeEnum;
  @Input() speed: number;
  @Input() size!: number;
  // @Input() tick!: number | null;
  @Input() trackType?: TrackTypeEnum;
  @Input() turboMultiplier: number;
  @Input() turretColor?: TankColorEnum;
  @Input() turretType?: TurretTypeEnum;
  @Input() worldSize!: number;
  // @Input() type todo: сделать type

  currentSpeed: number;
  direction: DirectionEnum;
  readonly explosionTypeEnum: typeof ExplosionTypeEnum;
  readonly directionEnum: typeof DirectionEnum;
  fireTrigger: number | null;
  isRotating: boolean;
  isShellVisible: boolean;
  isTurboActive: boolean;
  left: number;
  speedMultiplier: number;
  tick: number;
  top: number;

  private isReloading: boolean;
  private isSlowdownActive: boolean;
  private previousDirection: DirectionEnum;
  private readonly reloadingTime: number;
  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  get movementDelta(): number {
    return this.size / 4;
  }

  constructor(
    public readonly settings: SettingsService,
    private readonly store: Store,
    private readonly worldService: WorldService
  ) {
    this.armor = settings.tank.armor;
    this.color = settings.tank.color;
    this.currentSpeed = 0;
    this.direction = DirectionEnum.Up;
    this.directionEnum = DirectionEnum;
    this.explosionType = settings.tank.explosionType;
    this.explosionTypeEnum = ExplosionTypeEnum;
    this.fireTrigger = 0;
    this.flashType = settings.tank.flashType;
    this.gunType = settings.tank.gunType;
    this.hullType = settings.tank.hullType;
    this.isShellVisible = false;
    this.isTurboActive = false;
    this.left = 0;
    this.shellType = settings.tank.shellType;
    this.size = settings.world.size / settings.world.squaresPerSide;
    this.speed = settings.tank.speed;
    this.speedMultiplier = 1;
    // this.tick = null;
    this.top = 0;
    this.trackType = settings.tank.trackType;
    this.turboMultiplier = settings.tank.turboMultiplier;
    this.turretType = settings.tank.turretType;

    this.isReloading = false;
    this.isRotating = false;
    this.isSlowdownActive = false;
    this.previousDirection = this.direction;
    this.reloadingTime = 1000;
    this.subscription = new Subscription();
    this.tick = 0;
    this.tick$ = this.store.select(selectTick);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDirectionButton(event) && !this.isRotating) {
      this.previousDirection = this.direction;

      if (this.isDownButton(event)) {
        switch (this.previousDirection) {
          case DirectionEnum.Up:
            upDown((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            }, 100); // TODO: вот тут и везде ниже прописать множитель для поворота
            break;
          case DirectionEnum.Left:
            leftDown((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Right:
            rightDown((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          default:
            this.direction = DirectionEnum.Down;
            this.isRotating = false;
        }
      } else if (this.isLeftButton(event)) {
        switch (this.previousDirection) {
          case DirectionEnum.Up:
            upLeft((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Right:
            rightLeft((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Down:
            downLeft((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          default:
            this.direction = DirectionEnum.Left;
            this.isRotating = false;
        }
      } else if (this.isRightButton(event)) {
        switch (this.previousDirection) {
          case DirectionEnum.Up:
            upRight((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Left:
            leftRight((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Down:
            downRight((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          default:
            this.direction = DirectionEnum.Right;
            this.isRotating = false;
        }
      } else if (this.isUpButton(event)) {
        switch (this.previousDirection) {
          case DirectionEnum.Down:
            downUp((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Left:
            leftUp((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          case DirectionEnum.Right:
            rightUp((direction, isRotating) => {
              this.direction = direction;
              this.isRotating = isRotating;
            });
            break;
          default:
            this.direction = DirectionEnum.Up;
            this.isRotating = false;
        }
      }

      this.currentSpeed = this.speed;
    } else if (!this.isReloading && !this.isTurboActive && this.isFireButton(event)) {
      console.log('Fire');
      this.fire();
    } else if (!this.isSlowdownActive && this.isTurboButton(event)) {
      this.speedMultiplier = this.turboMultiplier;
      this.isTurboActive = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (this.isDirectionButton(event)) {
      this.currentSpeed = 0;
    } else if (this.isTurboButton(event)) {
      this.speedMultiplier = 1;
      this.isTurboActive = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если tick передаётся пропсом
    /*if (this.currentSpeed > 0) {
      this.move();
    }*/

    if (changes['size']?.currentValue !== changes['size']?.previousValue) {
      this.recalculatePosition(changes['size']?.previousValue);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        this.tick = tick;

        if (this.currentSpeed > 0) {
          this.move();
        }
      })
    );

    if (!this.hullColor) {
      this.hullColor = this.color;
    }

    if (!this.gunColor) {
      this.gunColor = this.color;
    }

    if (!this.turretColor) {
      this.turretColor = this.color;
    }
  }

  private fire(): void {
    this.isShellVisible = true;
    this.isReloading = true;
    const timerId = setTimeout(() => {
      this.isReloading = false;
      clearTimeout(timerId);
    }, this.reloadingTime);

    this.fireTrigger = this.tick;
  }

  private isDirectionButton(event: KeyboardEvent): boolean {
    return this.isDownButton(event) ||
      this.isLeftButton(event) ||
      this.isRightButton(event) ||
      this.isUpButton(event)
    ;
  }

  private isDownButton(event: KeyboardEvent): boolean {
    return this.settings.controls.down.includes(event.code);
  }

  private isFireButton(event: KeyboardEvent): boolean {
    return this.settings.controls.fire.includes(event.code);
  }

  private isLeftButton(event: KeyboardEvent): boolean {
    return this.settings.controls.left.includes(event.code);
  }

  private isRightButton(event: KeyboardEvent): boolean {
    return this.settings.controls.right.includes(event.code);
  }

  private isTurboButton(event: KeyboardEvent): boolean {
    return this.settings.controls.turbo.includes(event.code);
  }

  private isUpButton(event: KeyboardEvent): boolean {
    return this.settings.controls.up.includes(event.code);
  }

  private move(): void {
    if (this.isRotating) {
      return;
    }

    // TODO: прописать скорость для снарядов также
    const speed = this.settings.convertSpeed(this.speed);

    const distance = this.size * speed * this.speedMultiplier;
    const bottom = this.top + this.size;
    const right = this.left + this.size;
    let directionSquares: Array<Square> = [];

    switch (this.direction) {
      case DirectionEnum.Down:
        directionSquares = this.worldService.squares.filter((square) => (
          square.top < bottom + distance - this.movementDelta && // убрать this.movementDelta для строгого столкновения
          square.bottom > this.top + this.movementDelta &&
          square.left < right - this.movementDelta &&
          square.right > this.left + this.movementDelta
        ));

        if (directionSquares.find((square) => !square.isPassable)) {
          return;
        } else if (directionSquares.find((square) => square.type === SquareTypeEnum.Block)) {
          this.slowDown();
        }

        if (this.top + this.size + distance <= this.worldSize) {
          this.top = this.top + distance;
        }

        break;
      case DirectionEnum.Left:
        directionSquares = this.worldService.squares.filter((square) => (
          square.top < bottom - this.movementDelta &&
          square.bottom > this.top + this.movementDelta &&
          square.left < right - this.movementDelta &&
          square.right > this.left - distance + this.movementDelta // убрать this.movementDelta для строгого столкновения
        ));

        if (directionSquares.find((square) => !square.isPassable)) {
          return;
        } else if (directionSquares.find((square) => square.type === SquareTypeEnum.Block)) {
          this.slowDown();
        }

        if (this.left - distance >= 0) {
          this.left = this.left - distance;
        }

        break;
      case DirectionEnum.Right:
        directionSquares = this.worldService.squares.filter((square) => (
          square.top < bottom - this.movementDelta &&
          square.bottom > this.top + this.movementDelta &&
          square.left < right + distance - this.movementDelta && // убрать this.movementDelta для строгого столкновения
          square.right > this.left + this.movementDelta
        ));

        if (directionSquares.find((square) => !square.isPassable)) {
          return;
        } else if (directionSquares.find((square) => square.type === SquareTypeEnum.Block)) {
          this.slowDown();
        }

        if (this.left + this.size + distance <= this.worldSize) {
          this.left = this.left + distance;
        }

        break;
      case DirectionEnum.Up:
        directionSquares = this.worldService.squares.filter((square) => (
          square.top < bottom - this.movementDelta &&
          square.bottom > this.top - distance + this.movementDelta && // убрать this.movementDelta для строгого столкновения
          square.left < right - this.movementDelta &&
          square.right > this.left + this.movementDelta
        ));

        if (directionSquares.find((square) => !square.isPassable)) {
          return;
        } else if (directionSquares.find((square) => square.type === SquareTypeEnum.Block)) {
          this.slowDown();
        }

        if (this.top - distance >= 0) {
          this.top = this.top - distance;
        }

        break;
    }

    // console.log('directionSquares', directionSquares);
    this.worldService.directionSquares = directionSquares;
  }

  private recalculatePosition(previousSize?: number): void {
    if (!previousSize) {
      return;
    }

    this.top = this.top * this.size/previousSize;
    this.left = this.left * this.size/previousSize;
  }

  private slowDown(
    speedMultiplier = 0.1, // 0.1 todo: вынести в настройку blockSpeedMultiplier
    timeout: number = this.settings.interval
  ): void {
    this.isSlowdownActive = true;
    this.speedMultiplier = speedMultiplier;
    const timerId = setTimeout(() => {
      this.isSlowdownActive = false;
      this.speedMultiplier = 1;
      clearTimeout(timerId);
    }, timeout);
  }
}
