import { Component, OnInit, Input } from '@angular/core';

import { DirectionEnum } from '../../shared/direction.enum';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() armor!: number;
  @Input() isHidden?: boolean;
  @Input() tankDirection!: DirectionEnum;

  readonly directionEnum: typeof DirectionEnum;
  initialArmor: number;

  constructor() {
    this.directionEnum = DirectionEnum;
    this.initialArmor = 0;
  }

  ngOnInit(): void {
    this.initialArmor = this.armor;
  }
}
