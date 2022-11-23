import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { DirectionEnum } from '../../shared/direction.enum';
import { SettingsService } from '../../core/settings.service';
import { WorldService } from '../../world/world.service';

@Component({
  selector: 'app-player-indicator',
  templateUrl: './player-indicator.component.html',
  styleUrls: ['./player-indicator.component.scss']
})
export class PlayerIndicatorComponent implements OnDestroy, OnInit {
  @Input() isVisible: boolean;
  @Input() tankDirection?: DirectionEnum;

  @Output() readonly isVisibleChange: EventEmitter<boolean>;

  isHidden: boolean;
  readonly directionEnum: typeof DirectionEnum;

  private readonly subscription: Subscription;

  constructor(
    private settings: SettingsService,
    private worldService: WorldService
  ) {
    this.directionEnum = DirectionEnum;
    this.isHidden = true;
    this.isVisible = false;
    this.isVisibleChange = new EventEmitter<boolean>();

    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    let countdown = 6;

    this.subscription.add(
      interval(this.settings.millisecondsPerFrame).subscribe((tick) => {
        if (!this.worldService.isPauseMaskActive && (tick % (this.settings.fps/2) === 0)) {
          this.isHidden = !this.isHidden;
          countdown--;
        }

        if (!countdown) {
          this.isVisibleChange.emit(false);
        }
      })
    );
  }
}
