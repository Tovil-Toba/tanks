import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DPadButton } from './d-pad-button.enum';

@Component({
  selector: 'app-d-pad',
  templateUrl: './d-pad.component.html',
  styleUrls: ['./d-pad.component.scss']
})
export class DPadComponent {
  @Input() isPlayerActive?: boolean;

  @Output() readonly buttonDown: EventEmitter<DPadButton>;
  @Output() readonly buttonUp: EventEmitter<DPadButton>;

  button?: DPadButton;
  readonly dPadButton: typeof DPadButton;

  constructor() {
    this.buttonDown = new EventEmitter<DPadButton>();
    this.buttonUp = new EventEmitter<DPadButton>();
    this.dPadButton = DPadButton;
  }

  handleButtonDown(button: DPadButton): void {
    this.button = button;
    this.buttonDown.emit(button);
  }

  handleButtonUp(button: DPadButton): void {
    this.button = undefined;
    this.buttonUp.emit(button);
  }

  onContextMenu(event: Event): boolean {
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble = true;
    return false;
  }
}
