import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DPadModule } from '../d-pad/d-pad.module';
import { ExplosionComponent } from './explosion/explosion.component';
import { SquareComponent } from './square/square.component';
import { TankModule } from '../tank/tank.module';
import { TranslocoModule } from '@ngneat/transloco';
import { WorldComponent } from './world.component';

@NgModule({
  declarations: [
    ExplosionComponent,
    SquareComponent,
    WorldComponent,
  ],
  imports: [
    CommonModule,
    DPadModule,
    TankModule,
    TranslocoModule,
  ],
  exports: [
    WorldComponent,
  ],
})
export class WorldModule { }
