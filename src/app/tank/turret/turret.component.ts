import { Component, Input } from '@angular/core';

import { CRAFT_PIX_IMAGES_PATH } from '../../core/images.constants';
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

  readonly craftPixImagesPath = CRAFT_PIX_IMAGES_PATH;

  constructor(private settings: SettingsService) {
    this.color = settings.tank.color;
    this.type = settings.tank.turretType;
  }
}
