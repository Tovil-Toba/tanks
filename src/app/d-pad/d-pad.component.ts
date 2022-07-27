import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

import { DPadButton } from './d-pad-button.enum';

type Direction = DPadButton.Up | DPadButton.Right | DPadButton.Down | DPadButton.Left;

@Component({
  selector: 'app-d-pad',
  templateUrl: './d-pad.component.html',
  styleUrls: ['./d-pad.component.scss']
})
export class DPadComponent implements AfterViewInit, OnChanges {
  @Input() isPlayerActive?: boolean;
  @Input() worldSize!: number;

  @Output() readonly buttonDown: EventEmitter<DPadButton>;
  @Output() readonly buttonUp: EventEmitter<DPadButton>;

  @ViewChild('downButton') downButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('leftButton') leftButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('rightButton') rightButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('upButton') upButton?: ElementRef<HTMLButtonElement>;

  button?: DPadButton;
  readonly dPadButton: typeof DPadButton;

  private readonly directionButtons: Record<Direction, DOMRect | undefined>;
  private readonly directions: Array<Direction> = [DPadButton.Up, DPadButton.Right, DPadButton.Down, DPadButton.Left];

  constructor() {
    this.buttonDown = new EventEmitter<DPadButton>();
    this.buttonUp = new EventEmitter<DPadButton>();
    this.dPadButton = DPadButton;
    this.directionButtons = {
      [DPadButton.Up]: undefined,
      [DPadButton.Right]: undefined,
      [DPadButton.Down]: undefined,
      [DPadButton.Left]: undefined
    };
  }

  handleButtonDown(button: DPadButton): void {
    this.button = button;
    this.buttonDown.emit(button);
  }

  handleButtonUp(button: DPadButton): void {
    this.button = undefined;
    this.buttonUp.emit(button);
  }

  ngAfterViewInit(): void {
    this.setDirectionButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isPlayerActive && this.isPlayerActive !== changes['isPlayerActive']?.previousValue ||
      this.worldSize && this.worldSize !== changes['worldSize']?.previousValue
    ) {
      const timeoutId = setTimeout(() => {
        this.setDirectionButtons();
        clearTimeout(timeoutId);
      }, 0);
    }
  }

  onContextMenu(event: Event): boolean {
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble = true;
    return false;
  }

  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];

    this.directions.forEach((direction) => {
      this.checkDirection(direction, touch);
    });
  }

  private checkDirection(direction: Direction, touch: Touch): void {
    const directionButton = this.directionButtons[direction];

    if (directionButton &&
      touch.clientX >= directionButton.left  &&
      touch.clientX <= directionButton.right &&
      touch.clientY >= directionButton.top &&
      touch.clientY <= directionButton.bottom
    ) {
      switch (direction) {
        case DPadButton.Up:
          this.handleButtonDown(this.dPadButton.Up);
          break;
        case DPadButton.Down:
          this.handleButtonDown(this.dPadButton.Down);
          break;
        case DPadButton.Left:
          this.handleButtonDown(this.dPadButton.Left);
          break;
        case DPadButton.Right:
          this.handleButtonDown(this.dPadButton.Right);
          break;
      }
    }
  }

  private setDirectionButtons(): void {
    this.directionButtons[DPadButton.Up] = this.upButton?.nativeElement.getBoundingClientRect();
    this.directionButtons[DPadButton.Right] = this.rightButton?.nativeElement.getBoundingClientRect();
    this.directionButtons[DPadButton.Down] = this.downButton?.nativeElement.getBoundingClientRect();
    this.directionButtons[DPadButton.Left] = this.leftButton?.nativeElement.getBoundingClientRect();
  }
}
