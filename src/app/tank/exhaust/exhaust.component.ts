import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { EXHAUST_IMAGE_PATH } from '../../core/images.constants';
import { ExhaustSideEnum } from './exhaust-side.enum';
import { EXHAUST_STYLES, ExhaustStyle, ExhaustStyles } from './exhaust-styles';
import { ExhaustTypeEnum } from './exhaust-type.enum';
import { HullTypeEnum } from '../hull/hull-type.enum';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'app-exhaust',
  templateUrl: './exhaust.component.html',
  styleUrls: ['./exhaust.component.scss']
})
export class ExhaustComponent implements OnInit, OnDestroy {
  @Input() isRotating?: boolean;
  @Input() isTurboActive?: boolean;
  @Input() hullType?: HullTypeEnum;
  @Input() side?: ExhaustSideEnum;
  @Input() speed!: number;
  // @Input() tick!: number | null;

  readonly exhaustImagePath = EXHAUST_IMAGE_PATH;
  readonly exhaustSideEnum: typeof ExhaustSideEnum;
  readonly exhaustStyles: ExhaustStyles;
  frame: number | null;
  tick: number;
  type: ExhaustTypeEnum;

  private readonly framesCount = 10; // спрайты начинаются с 0 - Sprite_Effects_Exhaust_01_000.png
  private readonly tick$: Observable<number>;
  private readonly subscription: Subscription;

  constructor(
    private readonly settings: SettingsService,
    private readonly store: Store
  ) {
    this.exhaustSideEnum = ExhaustSideEnum;
    this.exhaustStyles = EXHAUST_STYLES;
    this.frame = null;
    this.tick = 0;
    this.type = ExhaustTypeEnum.One;

    this.tick$ = store.select(selectTick);
    this.subscription = new Subscription();
  }

  get style(): ExhaustStyle {
    return this.exhaustStyles[this.hullType ?? this.settings.tank.hullType];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        this.tick = tick;
        this.getCurrentFrame();
      })
    );
  }

  // Если tick передаётся пропсом
  /*ngOnChanges(changes: SimpleChanges): void {
    this.getCurrentFrame();
  }*/

  private getCurrentFrame(): void {
    if ((this.speed > 0 || this.isRotating) && this.tick) {
      if (this.frame === null) {
        this.frame = 0;
      } else if (this.tick % 3 === 0) { // todo: 3 - это 33.33 (30 fps) * 3 = 100мс, сделать динамическим в зависимости от fps
        this.frame++;
      }

      if (this.type === ExhaustTypeEnum.One) {
        if (this.isTurboActive) {
          if (this.frame <= 7) {
            this.frame = 7;
          } else if (this.frame >= this.framesCount) {
            this.type = ExhaustTypeEnum.Two;
            this.frame = null;
          }
        } else if (!this.isTurboActive && (this.frame >= this.framesCount - 2)) { // Т.к. последние 2 кадра - переход в турбо
          this.frame = 3; // первые 3 кадра - выхлопные газы, поэтому зацикливается с четвертого
        }
      } else {
        if (this.frame >= this.framesCount) {
          this.frame = 0;
        } else if (!this.isTurboActive) {
          this.type = ExhaustTypeEnum.One;
          this.frame = 3;
        }
      }
    } else {
      this.frame = null;
      this.type = ExhaustTypeEnum.One;
    }
  }
}
