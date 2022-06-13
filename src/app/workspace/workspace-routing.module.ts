import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReqComponent } from './add-req/add-req.component';
import { DocComponent } from './doc/doc.component';
import { WorkspaceComponent } from './workspace.component';

const routes: Routes = [
  {
    path:'',
    component:WorkspaceComponent,
    children:[
      {
        path:'request/:id',
        component:WorkspaceComponent
      }
    ]
  },
  {
    path:'documentation/:cid',
    component:DocComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
