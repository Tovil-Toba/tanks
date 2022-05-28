import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { map, Observable, of, take, timer } from 'rxjs';

import { FlashTypeEnum } from './flash-type.enum';
import { FLASH_IMAGE_PATH } from '../../core/images.constants';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.scss']
})
export class FlashComponent implements OnChanges {
  @Input() interval: number;
  @Input() height?: string;
  @Input() left?: string;
  @Input() top?: string;
  @Input() trigger!: number | null;
  @Input() type?: FlashTypeEnum;
  @Input() width?: string;

  readonly flashImagePath = FLASH_IMAGE_PATH;
  frame$: Observable<number | null>;
  readonly framesCount = 4;

  constructor(private settings: SettingsService) {
    // todo: оптимизировать пропсы
    this.type = settings.tank.flashType;
    this.frame$ = of(null);
    this.interval = settings.interval;
    this.height = '100%';
    this.left = '0';
    this.trigger = 0;
    this.top = '-70%';
    this.width = '100%';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']?.currentValue &&
      changes['trigger'].currentValue !== changes['trigger']?.previousValue
    ) {
      this.fire();
    }
  }

  private fire(): void {
    this.frame$ = timer(0, this.interval).pipe(
      take(this.framesCount + 1),
      map((n) => n)
    );
  }
}
