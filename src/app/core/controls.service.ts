import { Injectable } from '@angular/core';

import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  constructor(private settings: SettingsService) { }

  isDirectionButton(event: KeyboardEvent): boolean {
    return this.isDownButton(event) ||
      this.isLeftButton(event) ||
      this.isRightButton(event) ||
      this.isUpButton(event)
    ;
  }

  isDownButton(event: KeyboardEvent): boolean {
    return this.settings.controls.down.includes(event.code);
  }

  isFireButton(event: KeyboardEvent): boolean {
    return this.settings.controls.fire.includes(event.code);
  }

  isLeftButton(event: KeyboardEvent): boolean {
    return this.settings.controls.left.includes(event.code);
  }

  isPauseButton(event: KeyboardEvent): boolean {
    return this.settings.controls.pause.includes(event.code);
  }

  isPlayerDisconnectButton(event: KeyboardEvent): boolean {
    return this.settings.controls.playerDisconnect.includes(event.code);
  }

  isRightButton(event: KeyboardEvent): boolean {
    return this.settings.controls.right.includes(event.code);
  }

  isTurboButton(event: KeyboardEvent): boolean {
    return this.settings.controls.turbo.includes(event.code);
  }

  isUpButton(event: KeyboardEvent): boolean {
    return this.settings.controls.up.includes(event.code);
  }
}
