import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'request/overview',
    pathMatch:'full',
  },
  {
    path:'request/:id',
    component:WorkspaceComponent
  },
  {
    path:'documentation/:id',
    component:WorkspaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
