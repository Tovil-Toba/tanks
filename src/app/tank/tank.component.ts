import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Coordinates } from '../shared/coordinates.model';
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
import { TankFireService } from '../core/tank-fire.service';
import { TankIndex, TANKS_INDEXES } from './tank-index.model';
import { TankMovement } from '../core/tank-movement.model';
import { TankMovementService } from '../core/tank-movement.service';
import { TrackTypeEnum } from './track/track-type.enum';
import { TurretTypeEnum } from './turret/turret-type.enum';
import { WorldService } from '../world/world.service';

@Component({
  selector: 'app-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.scss'],
  providers: [TankFireService]
})
export class TankComponent implements OnChanges, OnDestroy, OnInit {
  @Input() armor?;
  @Input() color: TankColorEnum;
  @Input() directionControl?: DirectionEnum;
  @Input() explosionType: ExplosionTypeEnum;
  @Input() flashType: FlashTypeEnum;
  @Input() gunColor?: TankColorEnum;
  @Input() gunType: GunTypeEnum;
  @Input() hullColor?: TankColorEnum;
  @Input() index!: TankIndex;
  @Input() isExplode?: boolean;
  @Input() isFireControl?: boolean;
  @Input() isTurboControl?: boolean;
  @Input() hullType: HullTypeEnum;
  @Input() name?: string;
  @Input() shellType: ShellTypeEnum;
  @Input() shellImpactType: ShellImpactTypeEnum;
  @Input() shellSpeed: number;
  @Input() speed: number;
  @Input() size!: number;
  // @Input() tick!: number | null;
  @Input() trackType: TrackTypeEnum;
  @Input() turboMultiplier: number;
  @Input() turretColor?: TankColorEnum;
  @Input() turretType: TurretTypeEnum;
  @Input() worldSize!: number;
  // @Input() type todo: сделать type

  @Output() readonly moving: EventEmitter<TankMovement>;

  currentSpeed: number;
  direction: DirectionEnum;
  readonly directionEnum: typeof DirectionEnum;
  explosionFrame: number;
  fireTrigger: number | null;
  isPlayerIndicatorVisible: boolean;
  isRotating: boolean;
  isShellVisible: boolean;
  isTurboActive: boolean;
  left: number;
  speedMultiplier: number;
  tick: number;
  top: number;

  private isPlayer?: boolean;
  private isReloading: boolean;
  private isSlowdownActive: boolean;
  private previousDirection: DirectionEnum;
  private readonly reloadingTime: number;
  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    public settings: SettingsService,
    private store: Store,
    private tankFireService: TankFireService,
    private tankMovementService: TankMovementService,
    private worldService: WorldService
  ) {
    this.armor = settings.tank.armor;
    this.moving = new EventEmitter<TankMovement>();
    this.color = settings.tank.color;
    this.currentSpeed = 0;
    this.direction = DirectionEnum.Up;
    this.directionEnum = DirectionEnum;
    this.explosionFrame = 0;
    this.explosionType = settings.tank.explosionType;
    this.fireTrigger = 0;
    this.flashType = settings.tank.flashType;
    this.gunType = settings.tank.gunType;
    this.hullType = settings.tank.hullType;
    this.isPlayerIndicatorVisible = false;
    this.isShellVisible = false;
    this.isTurboActive = false;
    this.left = 0;
    this.shellType = settings.tank.shellType;
    this.shellImpactType = settings.tank.shellImpactType;
    this.shellSpeed = settings.tank.shellSpeed;
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

  get movementDelta(): number {
    return this.size / 4;
  }

  private get bottom(): number {
    return this.top + this.size;
  }

  private get cornersCoordinates(): Array<{ top: number, left: number }>{
    const squaresPerSide = this.settings.world.squaresPerSide;

    return [
      { top: 0, left: 0 },
      { top: 0, left: (squaresPerSide - 1) * this.size },
      { top: (squaresPerSide - 1) * this.size, left: 0 },
      { top: (squaresPerSide - 1) * this.size, left: (squaresPerSide - 1) * this.size }
    ];
  }

  private get movementDistance(): number {
    const convertedSpeed = this.settings.convertSpeed(this.speed);
    return this.size * convertedSpeed * this.speedMultiplier;
  }

  private get right(): number {
    return this.left + this.size;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если tick передаётся пропсом
    /*if (this.currentSpeed > 0) {
      this.move();
    }*/

    if (changes['size']?.currentValue !== changes['size']?.previousValue) {
      this.recalculatePosition(changes['size']?.previousValue as number);
    }

    if (changes['directionControl']?.currentValue !== changes['directionControl']?.previousValue) {
      this.handleDirectionControl();
    }

    /*if (changes['isFireControl']?.currentValue !== changes['isFireControl']?.previousValue) {
      this.handleFireControl();
    }*/

    if (changes['isTurboControl']?.currentValue !== changes['isTurboControl']?.previousValue) {
      this.handleTurboControl();
    }

    if (this.index === this.tankMovementService.playerTankIndex && !this.isPlayer) {
      this.isPlayer = true;
      this.showPlayerIndicator();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.initCoordinates();
    this.initDirection();
    let explosionFrame = 0;

    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        this.tick = tick;

        if (this.currentSpeed > 0) {
          this.move();
        }

        if (this.isExplode) {
          this.worldService.destroyedTankIndexes.add(this.index);

          if (explosionFrame >= this.settings.fps / 2) { // todo: Сделать случайным расстояние (explosionFrame),
                                                         //  которое танк может проехать после попадания.
                                                         //  Прикрутить также постепенную и случайную
                                                         //  потерю скорости во время взрыва.
            this.currentSpeed = 0;
          }

          explosionFrame++;
        }

        // Вынесено сюда, чтобы стрельба продолжалась при зажатой кнопке
        if (this.isFireControl) {
          this.handleFireControl();
        }

        // Стрельба ИИ
        this.checkTargets();
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

  private checkDirection(
    direction: DirectionEnum,
    coordinates: Coordinates,
    isStrictImpact = false
  ): boolean {
    const movementDelta = isStrictImpact ? 0 : this.movementDelta;
    const distance = this.movementDistance;

    return coordinates.top < this.bottom - movementDelta + (direction === DirectionEnum.Down ? distance : 0) &&
      coordinates.bottom > this.top + movementDelta - (direction === DirectionEnum.Up ? distance : 0) &&
      coordinates.left < this.right - movementDelta + (direction === DirectionEnum.Right ? distance : 0) &&
      coordinates.right > this.left + movementDelta - (direction === DirectionEnum.Left ? distance : 0)
    ;
  }

  private checkDownDirection(coordinates: Coordinates, isStrictImpact = false): boolean {
    return this.checkDirection(DirectionEnum.Down, coordinates, isStrictImpact);
  }

  private checkLeftDirection(coordinates: Coordinates, isStrictImpact = false): boolean {
    return this.checkDirection(DirectionEnum.Left, coordinates, isStrictImpact);
  }

  private checkRightDirection(coordinates: Coordinates, isStrictImpact = false): boolean {
    return this.checkDirection(DirectionEnum.Right, coordinates, isStrictImpact);
  }

  private checkUpDirection(coordinates: Coordinates, isStrictImpact = false): boolean {
    return this.checkDirection(DirectionEnum.Up, coordinates, isStrictImpact);
  }

  private checkTargets(): void {
    if (this.isExplode || this.index === this.tankMovementService.playerTankIndex) {
      return;
    }

    const targetDirections: Array<DirectionEnum> = this.tankFireService.checkTargets(this.index);

    if (targetDirections.includes(this.direction)) {
      this.fire();
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

  private handleDirectionControl(): void {
    if (this.directionControl && !this.isRotating) {
      this.previousDirection = this.direction;

      switch (this.directionControl) {
        case DirectionEnum.Down:
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
          break;
        case DirectionEnum.Left:
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
          break;
        case DirectionEnum.Right:
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
          break;
        case DirectionEnum.Up:
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
          break;
      }

      this.currentSpeed = this.speed;
    } else {
      this.currentSpeed = 0;
    }
  }

  private handleFireControl(): void {
    if (this.isFireControl &&
      !this.isReloading &&
      !this.isRotating &&
      !this.isTurboActive
    ) {
      this.fire();
    }
  }

  private handleTurboControl(): void {
    if (this.isTurboControl && !this.isSlowdownActive) {
      this.speedMultiplier = this.turboMultiplier;
      this.isTurboActive = true;
    } else {
      this.speedMultiplier = 1;
      this.isTurboActive = false;
    }
  }

  private initCoordinates(): void {
    this.left = this.cornersCoordinates[this.index].left;
    this.top = this.cornersCoordinates[this.index].top;
    const coordinates: Coordinates = {
      top: this.top,
      right: this.left + this.size,
      bottom: this.top + this.size,
      left: this.left
    };
    this.tankMovementService.setTankCoordinates(this.index, coordinates);
  }

  private initDirection(): void {
    if (this.index <= 1) {
      this.direction = DirectionEnum.Down;
    } else {
      this.direction = DirectionEnum.Up;
    }
  }

  // todo: Класс стал слишком большим, в том числе и этот метод. Попробовать разбить на части
  private move(): void {
    if (this.isRotating) {
      this.moving.emit({ direction: this.direction, canMove: true });

      return;
    }

    let directionSquares: Array<Square> = [];
    let impactedTanksCoordinates: Array<Coordinates> = [];

    const tanksCoordinates: Array<Coordinates> = [];
    for (const tankIndex of TANKS_INDEXES) {
      if (tankIndex !== this.index) {
        tanksCoordinates.push(this.tankMovementService.getTankCoordinates(tankIndex));
      }
    }

    impactedTanksCoordinates = tanksCoordinates.filter((coordinates) => (
      this.checkDirection(this.direction, coordinates)
    ));

    if (impactedTanksCoordinates.length) {
      this.moving.emit({ direction: this.direction, canMove: false });

      return;
    }

    directionSquares = this.worldService.squares.filter((square) => (
      this.checkDirection(this.direction, square)
    ));

    if (directionSquares.find((square) => !square.isPassable)) {
      this.moving.emit({ direction: this.direction, canMove: false });

      return;
    } else if (directionSquares.find((square) => square.type === SquareTypeEnum.Block)) {
      this.slowDown();
    }

    let canMove = false;

    switch (this.direction) {
      case DirectionEnum.Down:
        if (this.top + this.size + this.movementDistance <= this.worldSize) {
          this.top = this.top + this.movementDistance;
          canMove = true;
        }

        break;
      case DirectionEnum.Left:
        if (this.left - this.movementDistance >= 0) {
          this.left = this.left - this.movementDistance;
          canMove = true;
        }

        break;
      case DirectionEnum.Right:
        if (this.left + this.size + this.movementDistance <= this.worldSize) {
          this.left = this.left + this.movementDistance;
          canMove = true;
        }

        break;
      case DirectionEnum.Up:
        if (this.top - this.movementDistance >= 0) {
          this.top = this.top - this.movementDistance;
          canMove = true;
        }

        break;
    }

    this.moving.emit({ direction: this.direction, canMove });
    const coordinates: Coordinates = {
      top: this.top,
      right: this.left + this.size,
      bottom: this.top + this.size,
      left: this.left
    };
    this.tankMovementService.setTankCoordinates(this.index, coordinates);
    this.tankMovementService.setDirectionSquares(this.index, directionSquares);
  }

  private recalculatePosition(previousSize?: number): void {
    if (!previousSize) {
      return;
    }

    this.top = this.top * this.size/previousSize;
    this.left = this.left * this.size/previousSize;
  }

  private showPlayerIndicator(): void {
    this.isPlayerIndicatorVisible = !!this.isPlayer;
  }

  private slowDown(
    speedMultiplier = 0.1, // 0.1 todo: вынести в настройку blockSpeedMultiplier
    timeout: number = this.settings.interval
  ): void {
    this.isSlowdownActive = true;
    this.speedMultiplier = speedMultiplier;
    const timerId = setTimeout(() => {
      this.isSlowdownActive = false;
      this.speedMultiplier = this.isTurboActive ? this.turboMultiplier : 1;
      clearTimeout(timerId);
    }, timeout);
  }
}
