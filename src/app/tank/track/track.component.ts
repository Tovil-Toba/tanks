import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { HullTypeEnum } from '../hull/hull-type.enum';
import { selectTick } from '../../store/tick.selectors';
import { SettingsService } from '../../core/settings.service';
import { TrackSideEnum } from './track-side.enum';
import { TRACK_IMAGE_PATH } from '../../core/images.constants';
import { TRACK_STYLES, TrackStyle, TrackStyles } from './track-styles';
import { TrackTypeEnum } from './track-type.enum';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnDestroy, OnInit {
  @Input() hullType?: HullTypeEnum;
  @Input() side!: TrackSideEnum;
  @Input() speed!: number;
  // @Input() tick!: number | null;
  @Input() type?: TrackTypeEnum;

  readonly trackImagePath = TRACK_IMAGE_PATH;
  readonly trackSide: typeof TrackSideEnum;
  readonly trackStyles: TrackStyles;
  trigger: boolean;

  private readonly subscription: Subscription;
  private readonly tick$: Observable<number>;

  constructor(
    private readonly settings: SettingsService,
    private readonly store: Store
  ) {
    this.hullType = settings.tank.hullType;
    this.trackSide = TrackSideEnum;
    this.trackStyles = TRACK_STYLES;
    this.type = settings.tank.trackType;

    this.subscription = new Subscription();
    this.tick$ = store.select(selectTick);
    this.trigger = false;
  }

  get style(): TrackStyle {
    return this.trackStyles[this.hullType ?? this.settings.tank.hullType];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.tick$.subscribe((tick) => {
        if (tick % (this.settings.fps / 10) === 0) { // todo: привязать скорость
          this.trigger = !this.trigger;
        }
      })
    );
  }
}
