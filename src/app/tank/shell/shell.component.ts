import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Coordinates } from '../../shared/coordinates.model';
import { DirectionEnum } from '../../shared/direction.enum';
import { ExplosionTypeEnum } from '../../world/explosion/explosion-type.enum';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { SHELL_IMAGE_PATH } from '../../core/images.constants';
import { ShellTypeEnum } from './shell-type.enum';
import { ShellImpactTypeEnum } from './shell-impact/shell-impact-type.enum';
import { ShellImpactWithTank } from '../../world/shared/shell-impact-with-tank';
import { Square } from '../../world/square/square.model';
import { TankIndex, TANKS_INDEXES } from '../tank-index.model';
import { TankMovementService } from '../../core/tank-movement.service';
import { WorldService } from '../../world/world.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnChanges, OnDestroy, OnInit {
  @Input() explosionType?: ExplosionTypeEnum;
  @Input() impactType?: ShellImpactTypeEnum;
  @Input() initialDirection!: DirectionEnum;
  @Input() initialLeft!: number;
  @Input() initialTop!: number;
  @Input() isVisible: boolean;
  @Input() size!: number;
  @Input() speed!: number;
  @Input() tankIndex!: TankIndex;
  // @Input() tick!: number | null;
  @Input() type: ShellTypeEnum;
  @Input() worldSize!: number;

  @Output() readonly isVisibleChange: EventEmitter<boolean>;

  direction: DirectionEnum;
  readonly directionEnum: typeof DirectionEnum;
  readonly impactInterval: number;
  isImpact: boolean;
  left: number;
  readonly shellImagePath = SHELL_IMAGE_PATH;
  top: number;

  private readonly shellFileNames: Record<ShellTypeEnum, string>;
  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    public settings: SettingsService,
    private store: Store,
    private tankMovementService: TankMovementService,
    private worldService: WorldService
  ) {
    this.direction = DirectionEnum.Up;
    this.directionEnum = DirectionEnum;
    this.explosionType = settings.tank.explosionType;
    this.impactInterval = settings.interval;
    this.impactType = settings.tank.shellImpactType;
    this.isImpact = false;
    this.isVisible = false;
    this.isVisibleChange = new EventEmitter<boolean>();
    this.left = this.initialLeft;
    this.top = this.initialTop;
    this.type = settings.tank.shellType;
    this.size = settings.world.size / settings.world.squaresPerSide / 2;
    this.shellFileNames = {
      [ShellTypeEnum.Grenade]: 'Granade_Shell',
      [ShellTypeEnum.Heavy]: 'Heavy_Shell',
      [ShellTypeEnum.Laser]: 'Laser',
      [ShellTypeEnum.Light]: 'Light_Shell',
      [ShellTypeEnum.Medium]: 'Medium_Shell',
      [ShellTypeEnum.Plasma]: 'Plasma',
      [ShellTypeEnum.Shotgun]: 'Shotgun_Shells',
    };

    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
  }

  get movementDelta(): number {
    return this.size / 4;
  }

  get shellFileName(): string {
    return this.shellFileNames[this.type ?? this.settings.tank.shellType];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isVisible) {
      if (changes['initialDirection']?.currentValue !== changes['initialDirection']?.previousValue) {
        this.direction = changes['initialDirection'].currentValue as DirectionEnum;
        this.isImpact = false;
      }

      if (changes['initialLeft']?.currentValue !== changes['initialLeft']?.previousValue) {
        this.left = changes['initialLeft'].currentValue as number;
        this.isImpact = false;
      }

      if (changes['initialTop']?.currentValue !== changes['initialTop']?.previousValue) {
        this.top = changes['initialTop'].currentValue as number;
        this.isImpact = false;
      }
    }

    // Если tick передаётся пропсом
    /*if (!this.isImpact && this.isVisible && changes['tick']?.currentValue !== changes['tick']?.previousValue) {
      this.move();
    }*/
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe(() => {
        if (!this.isImpact && this.isVisible) {
          this.move();
        }
      })
    );
  }

  private checkImpact(coordinates: Coordinates): boolean {
    const bottom = this.top + this.size;
    const right = this.left + this.size;

    return coordinates.top <= this.top + this.size/2 &&
      coordinates.right >= right - this.size/2 &&
      coordinates.bottom >= bottom - this.size/2 &&
      coordinates.left <= this.left + this.size/2
    ;
  }

  // Альтернативный вариант проверки столкновения
  private checkImpactAlt(coordinates: Coordinates): boolean {
    const bottom = this.top + this.size;
    const right = this.left + this.size;

    return coordinates.top <= bottom - this.size/2 &&
      coordinates.right >= this.left + this.size/2 &&
      coordinates.bottom >= this.top + this.size/2 &&
      coordinates.left <= right - this.size/2
    ;
  }

  private move(): void {
    if (this.isImpact) {
      return;
    }

    const impactSquares: Array<Square> = this.worldService.squares
      .filter((square) => this.checkImpact(square))
      .filter((square) => (!square.isPassable || square.isDestroyable))
    ;

    if (impactSquares.length) {
      for (const square of impactSquares) {
        square.explosionType = this.explosionType;
      }

      this.worldService.shellImpactSquares = impactSquares;

      if (this.settings.isDebugMode) {
        console.log('Shell impact squares', this.worldService.shellImpactSquares);
      }

      this.impact();

      return;
    }

    for (const tankIndex of TANKS_INDEXES) {
      if (tankIndex === this.tankIndex) {
        continue;
      }

      const tankCoordinates: Coordinates = this.tankMovementService.getTankCoordinates(tankIndex);

      if (this.checkImpact(tankCoordinates)) {
        const shellsImpactWithTank = this.worldService
          .getShellsImpactByTankIndex(tankIndex)
          .filter((shellImpact) => shellImpact.parentTankIndex !== this.tankIndex)
        ;

        if (!shellsImpactWithTank.length) {
          const shellImpactWithTank: ShellImpactWithTank = {
            parentTankIndex: this.tankIndex,
            shellType: this.type,
            targetTankIndex: tankIndex
          };

          this.worldService.addShellImpactWithTank(shellImpactWithTank);
        }

        if (this.settings.isDebugMode) {
          console.log('Shells impact tank', this.worldService.getShellsImpactByTankIndex(tankIndex));
        }

        this.impact();

        return;
      }
    }

    const convertedSpeed = this.settings.convertSpeed(this.speed);
    const distance = this.settings.squareSize * convertedSpeed;
    let top = 0;
    let left = 0;

    switch (this.direction) {
      case DirectionEnum.Down:
        top = this.top + distance;

        if (top <= this.worldSize) { // this.settings.worldSize
          this.top = top;
        } else {
          this.resetShell();
        }

        break;
      case DirectionEnum.Left:
        left = this.left - distance;

        if (left >= 0) {
          this.left = left;
        } else {
          this.resetShell();
        }
        break;
      case DirectionEnum.Right:
        left = this.left + distance;

        if (left + this.size <= this.worldSize) {
          this.left = left;
        } else {
          this.resetShell();
        }

        break;
      case DirectionEnum.Up:
        top = this.top - distance;

        if (top >= 0) {
          this.top = top;
        } else {
          this.resetShell();
        }

        break;
    }
  }

  private impact(): void {
    const impactFrames = 4;
    this.isImpact = true; // todo: сделать опциональным аргументом может быть, и оптимизировать все, поправить наименования
    const timerId = setTimeout(() => {
      this.resetShell();
      clearTimeout(timerId);
    }, impactFrames * this.impactInterval);
  }

  private resetShell(): void {
    this.direction = this.initialDirection;
    this.top = this.initialTop;
    this.left = this.initialLeft;
    const timerId = setTimeout(() => {
      this.isVisibleChange.emit(false);
      this.isImpact = false;
      clearTimeout(timerId);
    }, 0);

    // console.log('Shell reset top', this.top);
    // console.log('Shell reset left', this.left);
  }
}
