import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, take, tap, timer } from 'rxjs';

import { BLAST_TRAIL_IMAGE_PATH, TANK_EXPLOSION_IMAGE_PATH } from '../../core/images.constants';
import { randomIntFromInterval } from '../../shared/utils';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss']
})
export class ExplosionComponent implements OnInit {
  @Input() interval: number;
  @Input() showBlastTrail: boolean;

  @Output() frame: EventEmitter<number>;

  readonly blastTrailImagePath: string;
  readonly blastTrailType: number;
  readonly explosionImagePath: string;
  frame$: Observable<number | null>;
  readonly framesCount = 9;
  readonly rotationRandomMultiplier: number;

  constructor(private settings: SettingsService) {
    this.blastTrailImagePath = BLAST_TRAIL_IMAGE_PATH;
    this.blastTrailType = randomIntFromInterval(4, 6);
    this.explosionImagePath = TANK_EXPLOSION_IMAGE_PATH;
    this.frame = new EventEmitter<number>();
    this.frame$ = of(null);
    this.interval = settings.interval;
    this.rotationRandomMultiplier = settings.world.isAssetsRandomRotationEnabled
      ? randomIntFromInterval(0, 3)
      : 0
    ;
    this.showBlastTrail = true;
  }

  ngOnInit(): void {
    this.frame$ = timer(0, this.interval).pipe(
      take(this.framesCount + 1),
      tap((n) => this.frame.emit(n))
    );
  }
}
