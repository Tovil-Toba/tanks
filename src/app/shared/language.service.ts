import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translocoService: TranslocoService
  ) { }

  setTitle(): void {
    const title: HTMLTitleElement = this.document.getElementsByTagName('title')[0];
    title.innerText = this.translocoService.translate('tanks');
  }
}
