import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkThemeFolder = 'mdc-dark-indigo';
  private readonly lightThemeFolder = 'mdc-light-indigo';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService
  ) { }

  initTheme(): void {
    const isDarkTheme = !!this.localStorageService.retrieve('isDarkTheme');
    this.setTheme(isDarkTheme);
  }

  setTheme(isDarkTheme: boolean): void {
    this.localStorageService.store('isDarkTheme', isDarkTheme);
    const themeLink: HTMLLinkElement = this.document.getElementById('theme-css') as HTMLLinkElement;
    const themeFolder = isDarkTheme ? this.darkThemeFolder : this.lightThemeFolder;
    themeLink.href = `assets/css/themes/${themeFolder}/theme.css`;
  }
}
