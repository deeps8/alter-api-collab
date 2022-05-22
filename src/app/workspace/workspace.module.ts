import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { WkTabComponent } from './wk-tab/wk-tab.component';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WkTabComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatTreeModule,
    MatTabsModule
  ]
})
export class WorkspaceModule { }
