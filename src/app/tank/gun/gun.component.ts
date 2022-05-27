import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { map, take, timer, of, Observable } from 'rxjs';

import { FlashTypeEnum } from '../flash/flash-type.enum';
import { GunTypeEnum } from './gun-type.enum';
import { SettingsService } from '../../core/settings.service';
import { TankColorEnum } from '../tank-color.enum';

@Component({
  selector: 'app-gun',
  templateUrl: './gun.component.html',
  styleUrls: ['./gun.component.scss']
})
export class GunComponent implements OnChanges {
  @Input() color?: TankColorEnum;
  @Input() flashType?: FlashTypeEnum;
  @Input() interval: number;
  @Input() trigger: number | null;
  @Input() type?: GunTypeEnum;

  top$: Observable<number>;

  constructor(private settings: SettingsService) {
    this.color = settings.tank.color;
    this.flashType = settings.tank.flashType;
    this.interval = settings.interval;
    this.trigger = null;
    this.top$ = of(0);
    this.type = settings.tank.gunType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']?.currentValue &&
      changes['trigger'].currentValue !== changes['trigger']?.previousValue
    ) {
      this.fire();
    }
  }

  private fire(): void {
    const tops = [10, 5, 0];
    this.top$ = timer(0, this.interval).pipe(
      take(3),
      map((i) => tops[i])
    );
  }
}
