import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  initials:string = localStorage.getItem('initials')?.toUpperCase() || "P";
  constructor(public authSV:AuthService) { }

  ngOnInit(): void {
  }

  logoutUser(){
    this.authSV.logout();
  }

}
