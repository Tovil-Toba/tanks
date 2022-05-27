import { Component, Input } from '@angular/core';

import { SettingsService } from '../../core/settings.service';
import { TankColorEnum } from '../tank-color.enum';
import { TurretTypeEnum } from './turret-type.enum';

@Component({
  selector: 'app-turret',
  templateUrl: './turret.component.html',
  styleUrls: ['./turret.component.scss']
})
export class TurretComponent {
  @Input() color?: TankColorEnum;
  @Input() type?: TurretTypeEnum;

  constructor(private settings: SettingsService) {
    this.color = settings.tank.color;
    this.type = settings.tank.turretType;
  }
}
