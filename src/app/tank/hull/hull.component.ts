import { Component, Input } from '@angular/core';

import { ExhaustSideEnum } from '../exhaust/exhaust-side.enum';
import { HullTypeEnum } from './hull-type.enum';
import { SettingsService } from '../../core/settings.service';
import { TankColorEnum } from '../tank-color.enum';
import { TrackTypeEnum } from '../track/track-type.enum';
import { TrackSideEnum } from '../track/track-side.enum';

@Component({
  selector: 'app-hull',
  templateUrl: './hull.component.html',
  styleUrls: ['./hull.component.scss']
})
export class HullComponent {
  @Input() color?: TankColorEnum;
  @Input() isRotating?: boolean;
  @Input() isTurboActive?: boolean;
  @Input() speed!: number;
  // @Input() tick!: number | null;
  @Input() trackType?: TrackTypeEnum;
  @Input() type?: HullTypeEnum;

  exhaustSideEnum: typeof ExhaustSideEnum;
  trackSideEnum: typeof TrackSideEnum;

  constructor(private settings: SettingsService) {
    this.color = settings.tank.color;
    this.exhaustSideEnum = ExhaustSideEnum;
    this.trackSideEnum = TrackSideEnum;
    this.trackType = settings.tank.trackType;
    this.type = settings.tank.hullType;
  }
}
