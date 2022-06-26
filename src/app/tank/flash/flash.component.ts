import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { FlashTypeEnum } from './flash-type.enum';
import { FLASH_IMAGE_PATH } from '../../core/images.constants';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.scss']
})
export class FlashComponent implements OnChanges, OnDestroy {
  @Input() interval: number;
  @Input() height?: string;
  @Input() left?: string;
  @Input() top?: string;
  @Input() trigger!: number | null;
  @Input() type?: FlashTypeEnum;
  @Input() width?: string;

  readonly flashImagePath = FLASH_IMAGE_PATH;
  frame: number;
  readonly framesCount = 4;

  private subscription?: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    private settings: SettingsService,
    private store: Store
  ) {
    // todo: оптимизировать пропсы
    this.type = settings.tank.flashType;
    this.frame = -1;
    this.interval = settings.interval;
    this.height = '100%';
    this.left = '0';
    this.trigger = 0;
    this.top = '-70%';
    this.width = '100%';

    this.tick$ = store.select(selectTick);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']?.currentValue &&
      changes['trigger'].currentValue !== changes['trigger']?.previousValue
    ) {
      this.fire();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private fire(): void {
    // eslint-disable-next-line rxjs-angular/prefer-async-pipe
    this.subscription = this.tick$.subscribe((tick) => {
      if (tick % (this.settings.fps / 10) === 0) {
        if (this.frame < this.framesCount) {
          this.frame++;
        } else {
          this.subscription?.unsubscribe();
          this.frame = -1;
        }
      }
    });
  }
}
