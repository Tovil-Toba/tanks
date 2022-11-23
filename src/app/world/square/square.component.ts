import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BLOCK_IMAGE_PATH, GROUND_IMAGE_PATH, HEDGEHOG_IMAGE_PATH } from '../../core/images.constants';
import { ExplosionTypeEnum } from '../explosion/explosion-type.enum';
import { randomIntFromInterval } from '../../shared/utils';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { Square } from './square.model';
import { SquareTypeEnum } from './square-type.enum';
import { TankMovementService } from '../../core/tank-movement.service';
import { WorldService } from '../world.service';
import { WorldTypeEnum } from '../world-type.enum';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnChanges, OnDestroy, OnInit {
  @Input() index!: number;
  @Input() size!: number;
  // @Input() tick!: number | null;
  @Input() type!: SquareTypeEnum;
  @Input() worldType: WorldTypeEnum;

  //currentType!: SquareTypeEnum;
  backgroundImage?: string;
  readonly collisionExplosionType: ExplosionTypeEnum;
  explosionType: ExplosionTypeEnum;
  image?: string;
  isExplode: boolean;
  readonly rotationRandomMultiplier: number;
  squareTypeEnum: typeof SquareTypeEnum;
  tick: number;

  private isCollision?: boolean;
  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    public settings: SettingsService,
    private store: Store,
    private tankMovementService: TankMovementService,
    private worldService: WorldService
  ) {
    this.rotationRandomMultiplier = settings.world.isAssetsRandomRotationEnabled
      ? randomIntFromInterval(0, 3)
      : 0
    ;
    this.explosionType = settings.tank.explosionType;
    this.collisionExplosionType = settings.world.collisionExplosionType;
    this.isExplode = false;
    this.size = settings.world.size / settings.world.squaresPerSide;
    this.squareTypeEnum = SquareTypeEnum;
    this.worldType = WorldTypeEnum.A;
    this.tick = 0;

    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
  }

  get isActive(): boolean {
    return this.tankMovementService.directionSquaresArray
      .filter((square) => square.index === this.index)
      .length > 0
    ;
  }

  get isDestroyable(): boolean {
    return this.worldService.squares[this.index].isDestroyable;
  }

  get movementDelta(): number {
    return this.size / 2 / 4;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если tick передаётся пропсом
    // this.checkSquare();

    if (changes['worldType']?.currentValue !== changes['worldType']?.previousValue) {
      this.initImages();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.tick$.subscribe((tick) => {
        this.tick = tick;
        this.checkSquare();
      })
    );
    // this.currentType = this.type;
    // this.initImages();
  }

  private checkSquare(): void {
    if ([SquareTypeEnum.Empty, SquareTypeEnum.Hedgehog].includes(this.type) || this.isCollision) {
      return;
    }

    const directionSquare: Square | undefined = this.tankMovementService.directionSquaresArray
      .find((square) => square.index === this.index)
    ;
    const shellImpactSquare: Square | undefined = this.worldService.shellImpactSquares
      ?.find((square) => square.index === this.index)
    ;

    if (directionSquare || shellImpactSquare) {
      this.isCollision = true;

      if (this.settings.isDebugMode && shellImpactSquare) {
        console.log('Shell impact square', shellImpactSquare);
      }

      const explosionTimerId = setTimeout(() => {
        if (directionSquare) {
          this.explosionType = this.collisionExplosionType;
        } else {
          this.explosionType = shellImpactSquare?.explosionType as ExplosionTypeEnum;
        }

        //if (shellImpactSquare) {
        this.isExplode = true;
        //}

        this.type = SquareTypeEnum.Empty;
        this.image = undefined;
        this.worldService.squares[this.index].type = SquareTypeEnum.Empty;
        this.worldService.squares[this.index].isDestroyable = false;
        clearTimeout(explosionTimerId);
      }, this.settings.interval);
    }
  }

  private initImages(): void {
    let image;

    switch (this.type) {
      case SquareTypeEnum.Block:
        image = `${BLOCK_IMAGE_PATH}/Block_${this.worldType}_02.png`;
        break;
      case SquareTypeEnum.Empty:
        image = undefined;
        break;
      case SquareTypeEnum.Hedgehog:
        image = `${HEDGEHOG_IMAGE_PATH}/Czech_Hdgehog_A.png`;
        break;
    }

    this.image = image;
    const rand = randomIntFromInterval(1, 2);
    this.backgroundImage = `url(${GROUND_IMAGE_PATH}/Ground_Tile_0${rand}_${this.worldType}.png)`;
  }
}
