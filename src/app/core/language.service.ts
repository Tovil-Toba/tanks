import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { TranslocoService } from '@ngneat/transloco';

import { Language } from './language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly languages: Array<Language> = ['en', 'ru'];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService,
    private translocoService: TranslocoService
  ) { }

  get defaultLanguage(): Language {
    const browserLanguages = this.document.defaultView?.navigator.languages;

    return (browserLanguages?.includes('ru') || browserLanguages?.includes('ru-RU')) ? 'ru' : 'en';
  }

  initLanguage(): void {
    let language = this.localStorageService.retrieve('language') as Language | undefined;

    if (!language || !this.languages.includes(language)) {
      language = this.defaultLanguage;
      this.localStorageService.store('language', language);
    }

    this.translocoService.setDefaultLang(language);
    this.translocoService.setActiveLang(language);
  }

  setLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
    this.localStorageService.store('language', language);
  }

  setTitle(): void {
    const title: HTMLTitleElement = this.document.getElementsByTagName('title')[0];
    title.innerText = this.translocoService.translate('tanks');
  }
}
