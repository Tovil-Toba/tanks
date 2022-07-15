import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { TankModule } from './tank/tank.module';
import { tickReducer } from './store/tick.reducer';
import { WorldModule } from './world/world.module';
import { worldNumberReducer } from './store/world-number.reducer';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    HttpClientModule,
    ProgressSpinnerModule,
    RippleModule,
    StoreModule.forRoot({ tick: tickReducer, worldNumber: worldNumberReducer }),
    TankModule,
    WorldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
