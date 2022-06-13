import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationModel } from '../models/notification.model';
import { AuthService } from '../services/auth/auth.service';
import { DialogService } from '../services/dialog/dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  initials:string = localStorage.getItem('initials')?.toUpperCase() || "P";
  notifications:Observable<NotificationModel[]>;

  constructor(public authSV:AuthService,private dialogSv:DialogService) {
    this.notifications = this.authSV.getNotifications(); 
  }
  
  ngOnInit(): void {
  }

  logoutUser(){
    this.authSV.logout();
  }

  openDialog(){
    this.dialogSv.openInviteDialog();
  }

  openNotify(notification:NotificationModel){
    switch (notification.type) {
      case "Invite": this.dialogSv.openInivationDialog(notification);  break;
      case "New Issue":  break;
      case "New Request":  break;
    
      default:
        break;
    }  
  }

}
