import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';

// material module imports
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { WkCreateComponent } from './wk-create/wk-create.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MainComponent,
    WkCreateComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
  ]
})
export class DashboardModule { }
