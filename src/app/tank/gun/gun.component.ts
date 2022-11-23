import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CRAFT_PIX_IMAGES_PATH } from '../../core/images.constants';
import { FlashTypeEnum } from '../flash/flash-type.enum';
import { GunTypeEnum } from './gun-type.enum';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { TankColorEnum } from '../tank-color.enum';

@Component({
  selector: 'app-gun',
  templateUrl: './gun.component.html',
  styleUrls: ['./gun.component.scss']
})
export class GunComponent implements OnChanges, OnDestroy, OnInit {
  @Input() color?: TankColorEnum;
  @Input() flashType?: FlashTypeEnum;
  @Input() interval: number;
  @Input() trigger: number | null;
  @Input() type?: GunTypeEnum;

  readonly craftPixImagesPath = CRAFT_PIX_IMAGES_PATH;
  top: number;

  private isActive: boolean;
  private subscription: Subscription;
  private readonly tick$: Observable<number>;
  private readonly tops: number[];

  constructor(
    private settings: SettingsService,
    private store: Store
  ) {
    this.color = settings.tank.color;
    this.flashType = settings.tank.flashType;
    this.interval = settings.interval;
    this.trigger = null;
    this.top = 0;
    this.type = settings.tank.gunType;

    this.isActive = false;
    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
    this.tops = [10, 5, 0];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']?.currentValue &&
      changes['trigger'].currentValue !== changes['trigger']?.previousValue
    ) {
      this.isActive = true;
    }
  }

  ngOnInit(): void {
    let index = -1;

    this.subscription.add(
      this.tick$.subscribe((tick) => {
        if (!this.isActive) {
          return;
        }

        if (this.isActive && index < this.tops.length && tick % (this.settings.fps / 10) === 0) {
          index++;
          this.top = this.tops[index];
        }

        if (index >= this.tops.length - 1) {
          this.isActive = false;
          this.top = 0;
          index = -1;
        }
      })
    );
  }
}
