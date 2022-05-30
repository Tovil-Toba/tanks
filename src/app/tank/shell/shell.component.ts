import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DirectionEnum } from '../../shared/direction.enum';
import { ExplosionTypeEnum } from '../../world/explosion/explosion-type.enum';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { SHELL_IMAGE_PATH } from '../../core/images.constants';
import { ShellTypeEnum } from './shell-type.enum';
import { ShellImpactTypeEnum } from './shell-impact/shell-impact-type.enum';
import { Square } from '../../world/square/square.model';
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
  // @Input() tick!: number | null;
  @Input() type?: ShellTypeEnum;
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
    public readonly settings: SettingsService,
    private readonly store: Store,
    private readonly worldService: WorldService
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

  private move(): void {
    if (this.isImpact) {
      return;
    }

    const convertedSpeed = this.settings.convertSpeed(this.speed);
    const distance = this.settings.squareSize * convertedSpeed;
    const bottom = this.top + this.size;
    const right = this.left + this.size;
    const directionSquares: Array<Square> = this.worldService.squares.filter((square) => (
      square.top < bottom - this.size/2 &&
      square.bottom > this.top + this.size/2 &&
      square.left < right - this.size/2 &&
      square.right > this.left + this.size/2
    ));
    const impactSquares: Array<Square> = directionSquares.filter((square) => (
      !square.isPassable || square.isDestroyable
    ));

    if (impactSquares.length) {
      for (const square of impactSquares) {
        square.explosionType = this.explosionType;
      }

      this.worldService.impactSquares = impactSquares;
      this.impact();

      return;
    }

    switch (this.direction) {
      case DirectionEnum.Down:
        if (this.top + this.size + distance <= this.worldSize) { // this.settings.worldSize
          this.top = this.top + distance;
        } else {
          this.resetShell();
        }
        break;
      case DirectionEnum.Left:
        if (this.left - distance >= 0) {
          this.left = this.left - distance;
        } else {
          this.resetShell();
        }
        break;
      case DirectionEnum.Right:
        if (this.left + this.size + distance <= this.worldSize) {
          this.left = this.left + distance;
        } else {
          this.resetShell();
        }
        break;
      case DirectionEnum.Up:
        if (this.top - distance >= 0) {
          this.top = this.top - distance;
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
