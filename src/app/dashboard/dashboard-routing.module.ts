import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { WkCreateComponent } from './wk-create/wk-create.component';
// import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    children:[
      {
        path:'',
        component:MainComponent
      },
      {
        path:'workspace/create',
        component: WkCreateComponent,
      },
      {
        path:'profile',
        component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
