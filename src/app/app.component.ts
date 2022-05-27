import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ResizedEvent } from 'angular-resize-event';

import { randomIntFromInterval } from './shared/utils';
import { Settings } from './core/settings.model';
import { SettingsService } from './core/settings.service';
import { WorldTypeEnum } from './world/world-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  readonly settings$: Observable<Settings>;
  title = 'Tanks';
  readonly worldType: WorldTypeEnum;
  worldSize: number;

  private readonly subscription: Subscription;
  private readonly worldTypes: Array<WorldTypeEnum>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly settings: SettingsService
  ) {
    this.settings$ = this.httpClient.get<Settings>('assets/settings.json');
    this.subscription = new Subscription();
    this.worldSize = settings.world.size;
    this.worldTypes = [
      WorldTypeEnum.A,
      WorldTypeEnum.B,
      WorldTypeEnum.C
    ];
    this.worldType = this.worldTypes[randomIntFromInterval(0, 2)];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.settings$.subscribe((settings) => {
        this.settings.controls = settings.controls;
        this.settings.fps = settings.fps;
        this.settings.isDebugMode = settings.isDebugMode;
        this.settings.tank = settings.tank;
        this.settings.world = settings.world;
      })
    );
  }

  onWorldResize(event: ResizedEvent): void {
    this.worldSize = event.newRect.width;
  }
}
