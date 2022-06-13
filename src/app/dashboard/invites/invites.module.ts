import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitesComponent } from './invites.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [
  {
    path:':id',
    component:InvitesComponent
  },
  {
    path:'',
    component:InvitesComponent
  }
]

@NgModule({
  declarations: [
    InvitesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class InvitesModule { }
