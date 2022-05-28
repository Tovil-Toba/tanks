import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BLOCK_IMAGE_PATH, GROUND_IMAGE_PATH, HEDGEHOG_IMAGE_PATH } from '../../core/images.constants';
import { ExplosionTypeEnum } from '../explosion/explosion-type.enum';
import { randomIntFromInterval } from '../../shared/utils';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { Square } from './square.model';
import { SquareTypeEnum } from './square-type.enum';
import { WorldService } from '../world.service';
import { WorldTypeEnum } from '../world-type.enum';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnDestroy, OnInit {
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
  squareTypeEnum: typeof SquareTypeEnum;
  tick: number;

  private isCollision?: boolean;
  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    public readonly settings: SettingsService,
    private readonly store: Store,
    private readonly worldService: WorldService
  ) {
    this.explosionType = settings.tank.explosionType;
    this.collisionExplosionType = ExplosionTypeEnum.H; // todo: вынести в настройки
    this.isExplode = false;
    this.size = settings.world.size / settings.world.squaresPerSide;
    this.squareTypeEnum = SquareTypeEnum;
    this.worldType = WorldTypeEnum.A;
    this.tick = 0;

    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
  }

  get isDestroyable(): boolean {
    return this.worldService.squares[this.index].isDestroyable;
  }

  get movementDelta(): number {
    return this.size / 2 / 4;
  }

  /*ngOnChanges(changes: SimpleChanges): void {
    // Если tick передаётся пропсом
    // this.checkSquare();
  }*/

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        this.tick = tick;
        this.checkSquare();
      })
    );
    //this.currentType = this.type;
    this.initImages();
  }

  get isActive(): boolean {
    return this.worldService.directionSquares
      .filter((square) => square.index === this.index)
      .length > 0;
  }

  private checkSquare(): void {
    if ([SquareTypeEnum.Empty, SquareTypeEnum.Hedgehog].includes(this.type) || this.isCollision) {
      return;
    }

    const directionSquare: Square | undefined =
      this.worldService.directionSquares.find((square) => square.index === this.index);
    const impactSquare: Square | undefined =
      this.worldService.impactSquares?.find((square) => square.index === this.index);

    if (directionSquare || impactSquare) {
      this.isCollision = true;

      if (this.settings.isDebugMode && impactSquare) {
        console.log('Impact square', impactSquare);
      }

      const explosionTimerId = setTimeout(() => {
        if (directionSquare) {
          this.explosionType = this.collisionExplosionType;
        } else {
          this.explosionType = impactSquare?.explosionType as ExplosionTypeEnum;
        }

        //if (impactSquare) {
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
