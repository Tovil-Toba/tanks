import { NgModule } from '@angular/core';
import { AngularResizeEventModule } from 'angular-resize-event';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
    AngularResizeEventModule,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ tick: tickReducer, worldNumber: worldNumberReducer }),
    TankModule,
    WorldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
