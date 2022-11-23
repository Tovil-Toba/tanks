import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
export class FlashComponent implements OnChanges, OnDestroy, OnInit {
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

  private isActive: boolean;
  private subscription: Subscription;
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

    this.isActive = false;
    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']?.currentValue &&
      changes['trigger'].currentValue !== changes['trigger']?.previousValue
    ) {
      this.isActive = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.tick$.subscribe((tick) => {
        if (!this.isActive) {
          return;
        }

        if (this.isActive && this.frame < this.framesCount && tick % (this.settings.fps / 10) === 0) {
          this.frame++;
        }

        if (this.frame >= this.framesCount) {
          this.isActive = false;
          this.frame = -1;
        }
      })
    );
  }
}
