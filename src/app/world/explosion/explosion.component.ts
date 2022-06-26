import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  BLAST_TRAIL_IMAGE_PATH,
  COLLISION_IMAGE_PATH,
  CUSTOM_EXPLOSION_IMAGE_PATH,
  SQUARE_EXPLOSION_IMAGE_PATH
} from '../../core/images.constants';
import { ExplosionTypeEnum } from './explosion-type.enum';
import { randomIntFromInterval } from '../../shared/utils';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { WorldTypeEnum } from '../world-type.enum';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss']
})
export class ExplosionComponent implements OnDestroy, OnInit {
  @Input() interval: number;
  @Input() type?: ExplosionTypeEnum;
  @Input() showBlastTrail?: boolean;
  @Input() worldType?: WorldTypeEnum;

  readonly blastTrailType: number;
  frame: number;
  readonly framesCount = 5;
  readonly rotationRandomMultiplier: number;

  private subscription?: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    private settings: SettingsService,
    private store: Store
  ) {
    this.blastTrailType = randomIntFromInterval(1, 3);
    this.frame = 0;
    this.interval = settings.interval;
    this.rotationRandomMultiplier = settings.world.isAssetsRandomRotationEnabled
      ? randomIntFromInterval(0, 3)
      : 0
    ;
    this.type = settings.tank.explosionType;
    this.worldType = settings.world.type;

    this.tick$ = store.select(selectTick);
  }

  get collisionImage(): string | null {
    switch(this.worldType) {
      case WorldTypeEnum.A:
        return `${COLLISION_IMAGE_PATH}/Rock_01.png`;
      case WorldTypeEnum.B:
        return `${COLLISION_IMAGE_PATH}/Stump.png`;
      case WorldTypeEnum.C:
        return `${COLLISION_IMAGE_PATH}/Rock_03.png`;
      default:
        return null;
    }
  }

  get blastTrailImage(): string {
    return `${BLAST_TRAIL_IMAGE_PATH}/Blast_Trail_0${this.blastTrailType}.png`;
  }

  get isCollision(): boolean {
    return this.type === this.settings.world.collisionExplosionType;
  }

  get explosionImagePath(): string {
    return this.isCollision
      ? CUSTOM_EXPLOSION_IMAGE_PATH
      : SQUARE_EXPLOSION_IMAGE_PATH
    ;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    // eslint-disable-next-line rxjs-angular/prefer-async-pipe
    this.subscription = this.tick$.subscribe((tick) => {
      if (tick % (this.settings.fps / 10) === 0) {
        if (this.frame <= this.framesCount) {
          this.frame++;
        } else {
          this.subscription?.unsubscribe();
        }
      }
    });
  }
}
