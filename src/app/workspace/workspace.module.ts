import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { WkTabComponent } from './wk-tab/wk-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { AddReqComponent } from './add-req/add-req.component';
import { DocComponent } from './doc/doc.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WorkspaceComponent,
    WkTabComponent,
    AddReqComponent,
    DocComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkspaceRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatTreeModule,
    MatTabsModule,
    FormsModule,
    MonacoEditorModule,
    MatDialogModule,
    SharedModule,
  ]
})
export class WorkspaceModule { }
