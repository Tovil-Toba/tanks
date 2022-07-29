import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkThemeFolder = 'mdc-dark-indigo';
  private readonly lightThemeFolder = 'mdc-light-indigo';
  private readonly window: (Window & typeof globalThis) | null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService
  ) {
    this.window = this.document.defaultView;
  }

  initTheme(): void {
    let isDarkTheme: unknown = this.localStorageService.retrieve('isDarkTheme');

    if (typeof isDarkTheme !== 'boolean' &&
      this.window?.matchMedia &&
      this.window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      isDarkTheme = true;
    }

    this.setTheme(!!isDarkTheme);
  }

  setTheme(isDarkTheme: boolean): void {
    this.localStorageService.store('isDarkTheme', isDarkTheme);
    const themeLink: HTMLLinkElement = this.document.getElementById('theme-css') as HTMLLinkElement;
    const themeFolder = isDarkTheme ? this.darkThemeFolder : this.lightThemeFolder;
    themeLink.href = `assets/css/themes/${themeFolder}/theme.css`;
  }
}
