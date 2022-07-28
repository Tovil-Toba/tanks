import { Component, DoCheck, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { TranslocoService } from '@ngneat/transloco';

import { LanguageService } from './shared/language.service';
import { randomIntFromInterval } from './shared/utils';
import { Settings } from './core/settings.model';
import { SettingsService } from './core/settings.service';
import { WorldTypeEnum } from './world/world-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck, OnDestroy, OnInit {
  @ViewChild('header') headerRef?: ElementRef<HTMLElement>;
  @ViewChild('worldCont') worldContRef?: ElementRef<HTMLElement>;
  @ViewChild('footer') footerRef?: ElementRef<HTMLElement>;

  isDPadVisible: boolean;
  isLoading: boolean;
  isMenuVisible: boolean;
  isPlayerActive: boolean;
  isWorldExists: boolean;
  isWorldPauseActive: boolean;
  readonly settings$: Observable<Settings>;
  readonly window: (Window & typeof globalThis) | null;
  worldType: WorldTypeEnum;
  worldSize: number;
  year: number;

  private readonly subscription: Subscription;
  private readonly worldTypes: Array<WorldTypeEnum>;

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient,
    private languageService: LanguageService,
    private primengConfig: PrimeNGConfig,
    private settings: SettingsService,
    private translocoService: TranslocoService
  ) {
    this.isDPadVisible = !deviceDetectorService.isDesktop();
    this.isLoading = true;
    this.isMenuVisible = false;
    this.isPlayerActive = settings.isPlayerActive;
    this.isWorldExists = true;
    this.isWorldPauseActive = false;
    this.settings$ = this.httpClient.get<Settings>('assets/settings.json');
    this.worldSize = settings.world.size;
    this.worldTypes = [
      WorldTypeEnum.A,
      WorldTypeEnum.B,
      WorldTypeEnum.C
    ];
    this.worldType = this.worldTypes[randomIntFromInterval(0, 2)];
    this.year = new Date().getFullYear();

    this.subscription = new Subscription();
    this.window = this.document.defaultView;
  }

  get isLandscape(): boolean {
    if (!this.window) {
      return true;
    }

    return this.window.innerWidth > (this.window.innerHeight - this.headerHeight - this.footerHeight);
  }

  get isPortrait(): boolean {
    return !this.isLandscape;
  }

  private get headerHeight(): number {
    return this.headerRef?.nativeElement.offsetHeight ?? 0;
  }

  private get footerHeight(): number {
    return this.footerRef?.nativeElement.offsetHeight ?? 0;
  }

  closeMenu(): void {
    this.isMenuVisible = false;
    this.isWorldPauseActive = false;
  }

  onMenuHide(): void {
    this.isWorldPauseActive = false;
  }

  ngDoCheck(): void {
    if (this.worldContRef?.nativeElement.clientWidth &&
      this.worldSize !== this.worldContRef.nativeElement.clientWidth
    ) {
      this.worldSize = this.worldContRef.nativeElement.clientWidth;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.settings$.subscribe((settings) => {
        this.settings.controls = settings.controls;
        this.settings.fps = settings.fps;
        this.settings.isDebugMode = settings.isDebugMode;
        this.settings.isPlayerActive = settings.isPlayerActive;
        this.settings.tank = settings.tank;
        this.settings.units = settings.units;
        this.settings.world = settings.world;
        this.settings.world.type = this.worldType;
        this.isLoading = false;
      })
    );

    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.translocoService.selectTranslation().subscribe(() => {
        this.languageService.setTitle();
      })
    );
  }

  openMenu(): void {
    this.isMenuVisible = true;
    this.isWorldPauseActive = true;
  }

  resetWorld(worldType?: WorldTypeEnum): void {
    this.isWorldExists = false;
    const timeoutId = setTimeout(() => {
      if (worldType) {
        this.worldType = worldType;
      } else {
        this.setRandomWorldType();
      }

      this.isWorldExists = true;
      clearTimeout(timeoutId);
    }, 100);
  }

  toggleMenu(): void {
    if (this.isMenuVisible) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private setRandomWorldType(): void {
    this.worldType = this.worldTypes[randomIntFromInterval(0, 2)];
  }
}
