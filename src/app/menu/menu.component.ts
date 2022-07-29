import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { formatActionButton } from './format-action-button';
import { Language } from '../core/language.model';
import { LanguageService } from '../core/language.service';
import { SettingsService } from '../core/settings.service';
import { ThemeService } from '../core/theme.service';
import { WORLD_SIZES } from '../world/world-sizes';
import { WorldSizeEnum } from '../world/world-size.enum';
import { WorldTypeEnum } from '../world/world-type.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnDestroy, OnInit {
  @Input() isDPadVisible: boolean;
  @Input() isPlayerActive: boolean;
  @Input() isVisible: boolean;
  @Input() worldType: WorldTypeEnum;

  @Output() readonly hide: EventEmitter<void>;
  @Output() readonly isDPadVisibleChange: EventEmitter<boolean>;
  @Output() readonly isPlayerActiveChange: EventEmitter<boolean>;
  @Output() readonly isVisibleChange: EventEmitter<boolean>;
  @Output() readonly resetWorld: EventEmitter<void>;
  @Output() readonly worldTypeChange: EventEmitter<WorldTypeEnum>;

  controls!: Array<{ action: string; buttonOne: string; buttonTwo?: string }>;
  isDarkTheme: boolean;
  language: Language;
  languages: Array<{ label: string, value: Language }>;
  prevWorldSize: WorldSizeEnum;
  themes!: Array<{ label: string, value: boolean }>;
  worldSize: WorldSizeEnum;
  worldSizes!: Array<{ label: string, value: WorldSizeEnum }>;
  worldTypes!: Array<{ label: string, value: WorldTypeEnum }>;

  private readonly darkThemeFolder = 'mdc-dark-indigo';
  private readonly lightThemeFolder = 'mdc-light-indigo';
  private subscription: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private themeService: ThemeService,
    private settings: SettingsService,
    private translocoService: TranslocoService
  ) {
    this.hide = new EventEmitter<void>();
    this.isDarkTheme = !!localStorageService.retrieve('isDarkTheme');
    this.isDPadVisible = false;
    this.isDPadVisibleChange = new EventEmitter<boolean>();
    this.isPlayerActiveChange = new EventEmitter<boolean>();
    this.isPlayerActive = settings.isPlayerActive;
    this.isVisible = false;
    this.isVisibleChange = new EventEmitter<boolean>();
    this.language = translocoService.getDefaultLang() as Language;
    this.languages = [
      { label: 'Русский', value: 'ru' },
      { label: 'English', value: 'en' },
    ];
    this.resetWorld = new EventEmitter<void>();
    this.worldSize = WorldSizeEnum.Small;
    this.worldType = settings.world.type;
    this.worldTypeChange = new EventEmitter<WorldTypeEnum>();

    this.subscription = new Subscription();
    this.prevWorldSize = this.worldSize;
  }

  changeLanguage(): void {
    this.languageService.setLanguage(this.language);
  }

  changeTheme(): void {
    this.themeService.setTheme(this.isDarkTheme);
  }

  changeWorldType(): void {
    this.worldTypeChange.emit(this.worldType);
    this.settings.world.type = this.worldType;
  }

  close(resetWorld?: boolean): void {
    // this.worldTypeChange.emit(this.worldType);
    // this.settings.world.type = this.worldType;

    if (this.worldSize !== this.prevWorldSize) {
      this.prevWorldSize = this.worldSize;
      this.settings.world.squaresPerSide = WORLD_SIZES[this.worldSize];
      this.resetWorld.emit();
    } else if (resetWorld) {
      this.resetWorld.emit();
    }

    this.isVisibleChange.emit(false);
    this.hide.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      // eslint-disable-next-line rxjs-angular/prefer-async-pipe
      this.translocoService.selectTranslation().subscribe((translation) => {
        this.themes = [
          { label: translation['themes.light'] as string, value: false },
          { label: translation['themes.dark'] as string, value: true },
        ];

        this.worldSizes = [
          { label: translation['sizes.small'] as string, value: WorldSizeEnum.Small },
          { label: translation['sizes.medium'] as string, value: WorldSizeEnum.Medium },
          { label: translation['sizes.large'] as string, value: WorldSizeEnum.Large },
        ];

        this.worldTypes = [
          { label: translation['worldTypes.desert'] as string, value: WorldTypeEnum.A },
          { label: translation['worldTypes.forest'] as string, value: WorldTypeEnum.B },
          { label: translation['worldTypes.semiDesert'] as string, value: WorldTypeEnum.C },
        ];

        this.controls = [
          {
            action: translation['actions.up'] as string,
            buttonOne: formatActionButton(this.settings.controls.up[0]),
            buttonTwo: formatActionButton(this.settings.controls.up?.[1])
          },
          {
            action: translation['actions.left'] as string,
            buttonOne: formatActionButton(this.settings.controls.left[0]),
            buttonTwo: formatActionButton(this.settings.controls.left?.[1])
          },
          {
            action: translation['actions.down'] as string,
            buttonOne: formatActionButton(this.settings.controls.down[0]),
            buttonTwo: formatActionButton(this.settings.controls.down?.[1])
          },
          {
            action: translation['actions.right'] as string,
            buttonOne: formatActionButton(this.settings.controls.right[0]),
            buttonTwo: formatActionButton(this.settings.controls.right?.[1])
          },
          {
            action: translation['actions.fire'] as string,
            buttonOne: formatActionButton(this.settings.controls.fire[0]),
            buttonTwo: formatActionButton(this.settings.controls.fire?.[1])
          },
          {
            action: translation['actions.turbo'] as string,
            buttonOne: formatActionButton(this.settings.controls.turbo[0]),
            buttonTwo: formatActionButton(this.settings.controls.turbo?.[1])
          },
          {
            action: translation['actions.disconnect'] as string,
            buttonOne: formatActionButton(this.settings.controls.playerDisconnect[0]),
            buttonTwo: formatActionButton(this.settings.controls.playerDisconnect?.[1])
          },
        ];
      })
    );
  }
}

