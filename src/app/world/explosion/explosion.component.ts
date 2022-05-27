import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of, take, timer } from 'rxjs';

import { ExplosionTypeEnum } from './explosion-type.enum';
import { randomIntFromInterval } from '../../shared/utils';
import { SettingsService } from '../../core/settings.service';

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

  constructor(private settings: SettingsService) {
    this.blastTrailType = randomIntFromInterval(1, 3);
    this.frame$ = of(null);
    this.interval = settings.interval;
    this.type = settings.tank.explosionType;
  }

  get imagePath(): string {
    return this.type === ExplosionTypeEnum.H
      ? 'assets/images/explosions'
      : 'assets/images/craftpix/Bombs'
    ;
  }

  ngOnInit(): void {
    this.frame$ = timer(0, this.interval).pipe(
      take(this.framesCount + 1),
      map((n) => n + 1)
    );
  }
}
