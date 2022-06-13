import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvitationComponent } from 'src/app/block/invitation/invitation.component';
import { InviteDialogComponent } from 'src/app/dashboard/invite-dialog/invite-dialog.component';
import { NotificationModel } from 'src/app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:MatDialog,
              private snackBar: MatSnackBar,
              ) { 

  }

  openInviteDialog(){
    const inviteDialog = this.dialog.open(InviteDialogComponent,{
      autoFocus:true,
      minWidth:400,
      data:{
        usename:"deepak"
      }
    })
  }

  openMsgToast(msg:string,type:string){
    this.snackBar.open(msg,'',{
      horizontalPosition:'end',
      verticalPosition:'top',
      duration: 2000,
      panelClass:type,
      politeness:'polite'
    });
  }

  async openInivationDialog(notify:NotificationModel){
    this.dialog.open(InvitationComponent,{
      autoFocus:true,
      minWidth:400,
      data: notify
    })
    // console.log("Done");
  }
}
