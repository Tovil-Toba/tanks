import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of, take, timer } from 'rxjs';

import {
  BLAST_TRAIL_IMAGE_PATH,
  COLLISION_IMAGE_PATH,
  CUSTOM_EXPLOSION_IMAGE_PATH,
  EXPLOSION_IMAGE_PATH
} from '../../core/images.constants';
import { ExplosionTypeEnum } from './explosion-type.enum';
import { randomIntFromInterval } from '../../shared/utils';
import { SettingsService } from '../../core/settings.service';
import { WorldTypeEnum } from '../world-type.enum';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss']
})
export class ExplosionComponent implements OnInit {
  @Input() interval: number;
  @Input() type?: ExplosionTypeEnum;
  @Input() showBlastTrail?: boolean;

  blastTrailType: number;
  frame$: Observable<number | null>;
  readonly framesCount = 5;
  readonly rotationRandomMultiplier: number;

  constructor(private settings: SettingsService) {
    this.blastTrailType = randomIntFromInterval(1, 3);
    this.frame$ = of(null);
    this.interval = settings.interval;
    this.rotationRandomMultiplier = settings.world.isAssetsRandomRotationEnabled
      ? randomIntFromInterval(0, 3)
      : 0
    ;
    this.type = settings.tank.explosionType;
  }

  get collisionImage(): string | null {
    switch(this.settings.world.type) {
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
      : EXPLOSION_IMAGE_PATH
    ;
  }

  ngOnInit(): void {
    this.frame$ = timer(0, this.interval).pipe(
      take(this.framesCount + 1),
      map((n) => n + 1)
    );
  }
}
