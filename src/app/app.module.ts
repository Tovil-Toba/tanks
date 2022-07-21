import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StoreModule } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoRootModule } from './transloco-root.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { TankModule } from './tank/tank.module';
import { tickReducer } from './store/tick.reducer';
import { WorldModule } from './world/world.module';
import { worldNumberReducer } from './store/world-number.reducer';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    HttpClientModule,
    InputSwitchModule,
    ProgressSpinnerModule,
    RippleModule,
    SelectButtonModule,
    StoreModule.forRoot({ tick: tickReducer, worldNumber: worldNumberReducer }),
    TableModule,
    TabViewModule,
    TankModule,
    TooltipModule,
    TranslocoRootModule,
    WorldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
