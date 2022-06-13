import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { InviteModel } from 'src/app/models/invite.model';
import { NotificationModel } from 'src/app/models/notification.model';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit,OnDestroy {

  data!: InviteModel;
  invite$:Subscription;
  load:boolean = false;

  constructor(private workSV:WorkspaceService,
              private dialogRef:MatDialogRef<InvitationComponent>,
              @Inject(MAT_DIALOG_DATA) private notify:NotificationModel) {
    this.invite$ = workSV.getInviteDetails(notify.helperId).subscribe(res=>{
      this.data = res;
      // console.log(this.data);
    });
  }
  ngOnDestroy(): void {
    this.invite$.unsubscribe();
  }

  ngOnInit(): void {
  }



  async updateStatus(status:"Accepted" | "Rejected" | "Pending"){
    this.load = true;
    let newData:InviteModel = this.data;
    newData.status = status;
    await this.workSV.setInvitation(newData,this.notify.notifyId);
    this.load = false;
    this.dialogRef.close();
  }

}
