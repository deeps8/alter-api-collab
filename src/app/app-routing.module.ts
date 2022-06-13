import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './block/auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const unauthorized = ()=> redirectUnauthorizedTo(['auth/signin']);
const authorized = ()=> redirectLoggedInTo(['dashboard']);

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent,
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe: authorized }
  },
  {
    path:'auth/:type',
    component:AuthComponent,
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe: authorized }
  },
  {
    path:'auth',
    pathMatch:'full',
    redirectTo:'auth/signin'
  },
  {
    path:'dashboard',
    loadChildren: ()=> import('./dashboard/dashboard.module').then(m=>m.DashboardModule),
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe: unauthorized }
  },
  {
    path:'**',
    pathMatch:'full',
    redirectTo:'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
