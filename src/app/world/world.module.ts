import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplosionComponent } from './explosion/explosion.component';
import { SquareComponent } from './square/square.component';
import { TankModule } from '../tank/tank.module';
import { WorldComponent } from './world.component';

@NgModule({
  declarations: [
    ExplosionComponent,
    SquareComponent,
    WorldComponent,
  ],
  imports: [
    CommonModule,
    TankModule,
  ],
  exports: [
    WorldComponent,
  ],
})
export class WorldModule { }
