import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BLAST_TRAIL_IMAGE_PATH, TANK_EXPLOSION_IMAGE_PATH } from '../../core/images.constants';
import { randomIntFromInterval } from '../../shared/utils';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss']
})
export class ExplosionComponent implements OnDestroy, OnInit {
  @Input() interval: number;
  @Input() showBlastTrail: boolean;

  @Output() frameChange: EventEmitter<number>;

  readonly blastTrailImagePath: string;
  readonly blastTrailType: number;
  readonly explosionImagePath: string;
  frame: number;
  readonly framesCount = 9;
  readonly rotationRandomMultiplier: number;

  private subscription?: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    private settings: SettingsService,
    private store: Store
  ) {
    this.blastTrailImagePath = BLAST_TRAIL_IMAGE_PATH;
    this.blastTrailType = randomIntFromInterval(4, 6);
    this.explosionImagePath = TANK_EXPLOSION_IMAGE_PATH;
    this.frameChange = new EventEmitter<number>();
    this.frame = -1;
    this.interval = settings.interval;
    this.rotationRandomMultiplier = settings.world.isAssetsRandomRotationEnabled
      ? randomIntFromInterval(0, 3)
      : 0
    ;
    this.showBlastTrail = true;

    this.tick$ = store.select(selectTick);
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
          this.frameChange.emit(this.frame);
        } else {
          this.subscription?.unsubscribe();
        }
      }
    });
  }
}
