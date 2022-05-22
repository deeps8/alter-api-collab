import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { WkCreateComponent } from './wk-create/wk-create.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const unauthorized = ()=> redirectUnauthorizedTo(['auth/signin']);
const authorized = ()=> redirectLoggedInTo(['dashboard']);


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
      },
      {
        path:'workspace',
        loadChildren: ()=> import('../workspace/workspace.module').then(m=>m.WorkspaceModule),
        canActivate:[AngularFireAuthGuard],
        data:{authGuardPipe: unauthorized }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
