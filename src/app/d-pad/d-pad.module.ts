import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

import { DPadComponent } from './d-pad.component';

@NgModule({
  declarations: [
    DPadComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    RippleModule,
  ],
  exports: [
    DPadComponent,
  ],
})
export class DPadModule { }
