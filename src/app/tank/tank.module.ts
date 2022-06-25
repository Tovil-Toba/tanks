import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExhaustComponent } from './exhaust/exhaust.component';
import { ExplosionComponent } from './explosion/explosion.component';
import { FlashComponent } from './flash/flash.component';
import { GunComponent } from './gun/gun.component';
import { HullComponent } from './hull/hull.component';
import { PlayerIndicatorComponent } from './player-indicator/player-indicator.component';
import { ShellComponent } from './shell/shell.component';
import { ShellImpactComponent } from './shell/shell-impact/shell-impact.component';
import { TankComponent } from './tank.component';
import { TrackComponent } from './track/track.component';
import { TurretComponent } from './turret/turret.component';

@NgModule({
  declarations: [
    ExhaustComponent,
    ExplosionComponent,
    FlashComponent,
    GunComponent,
    HullComponent,
    PlayerIndicatorComponent,
    ShellComponent,
    ShellImpactComponent,
    TankComponent,
    TrackComponent,
    TurretComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TankComponent,
  ],
})
export class TankModule { }
