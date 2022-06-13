import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InviteModel } from 'src/app/models/invite.model';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html'
})
export class InvitesComponent implements OnInit, OnDestroy {

  inviteType:boolean = true;
  selectedWk:string | undefined;
  workName!:string;

  pending:InviteModel[] = [];
  accepted:InviteModel[] = [];
  allWorks!:Observable<WorkspaceModel[]>;

  constructor(private router:Router,
              private actRouter:ActivatedRoute,
              private workSV:WorkspaceService,
              private dialogSv:DialogService) {
      
      this.allWorks = this.workSV.getAllWorkspace();

      this.actRouter.params.subscribe(p=>{
        if(p['id'] !== undefined || p['id'] !== '')
          this.selectedWk = p['id'];
          this.workSV.getAllInvites(p['id']).subscribe(res=>{
            this.pending = res.pending;
            this.accepted = res.accepted;
            console.log(res);
          });
      });

  }
  
  ngOnInit(): void {
    console.log(this.workSV.workList);
  }

  ngOnDestroy(): void {
      
  }


  openWkInvite(wk:WorkspaceModel){
    this.selectedWk = wk.workId;
    this.workName = wk.name;
      this.router.navigate([this.selectedWk],{relativeTo:this.actRouter.parent});
      // console.log(this.selectedWk);
  }

  openDialog(){
      this.dialogSv.openInviteDialog();
  }

}
