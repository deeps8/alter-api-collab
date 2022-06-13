import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { AuthService } from '../auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { InviteModel } from 'src/app/models/invite.model';
import { UserModel } from 'src/app/models/user.model';
import { NotificationModel } from 'src/app/models/notification.model';


@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  
  workList:WorkspaceModel[] = [];

  constructor(private afstore:AngularFirestore,
              private authSV:AuthService,
              private dialogSV:DialogService,
              private router:Router) { }


  async addWorkspace(wk:WorkspaceModel,users:UserModel[]):Promise<boolean>{
    wk.workId = this.afstore.createId();
    console.log(users);
    await this.afstore.collection('workspace').doc(wk.workId).set(wk).then(async res=>{

     if(wk.type==="Personal"){
        this.dialogSV.openMsgToast("Workspace Added","success-toast");
        this.router.navigate(['/dashboard']);
        return false;
     }

     let invite:InviteModel,flag:boolean=true;

     for (const element of users) {
        invite = {
          invId : this.afstore.createId(),
          createdOn : (new Date()).toISOString(),  
          status : "Pending",
          workId : wk.workId,
          workspaceName : wk.name,
          sender : wk.owner,
          receiver : element
        };

        console.log(invite);

        await this.afstore.collection('invitation').doc(invite.invId).set(invite).then(async(_res)=>{

          let notify:NotificationModel = {
            title :`Workspace Invitaion`,
            createdOn : (new Date()).toISOString(),
            description : `You got an invite request from ${wk.owner.username} to join ${wk.name}.`,
            status : "Unread",
            notifyId : this.afstore.createId(),
            type : "Invite",
            helperId : invite.invId
          };

          console.log(notify);

          await this.afstore.collection(`userProfile`).doc(invite.receiver.uid).update({
                    notification: firebase.firestore.FieldValue.arrayUnion(notify) }).then(()=>{
                      return true;
                    }).catch(()=>{
                      return false;
                    });

        })
        .catch(()=>{
          this.dialogSV.openMsgToast("Something Went Wrong","error-toast");
          flag = false;
          return false;
        });
     }

      this.dialogSV.openMsgToast("Workspace Added","success-toast");

      this.router.navigate(['/dashboard']);
      return false; 
    })
    .catch(()=>{

      this.dialogSV.openMsgToast("Something Went Wrong","error-toast");
      return false;

    });
    return false;
  }

  getAllWorkspace():Observable<WorkspaceModel[]>{
    return this.afstore.collection<WorkspaceModel>(`workspace`).valueChanges().pipe(
                                                        map(wks=>{
                                                           
                                                          this.workList =  wks.filter(wk=>{
                                                            let f:boolean = false;
                                                            wk.team.forEach(t=>{
                                                              if(t.uid === this.authSV.userId){
                                                                f=true;
                                                                return;
                                                              }
                                                            });
                                                            return f;
                                                          });

                                                          return this.workList;

                                                        }),
                                                        catchError(()=>{
                                                          return throwError(()=>new Error("Get All WOrkspaces Error"))
                                                        })
                                                      );
  }


  async setInvitation(invite:InviteModel,notifyId:string){
    await this.afstore.collection("invitation").doc(invite.invId).set(invite).then(async()=>{

      console.log(invite.status,invite.invId);

      if(invite.status==="Accepted"){

        await this.afstore.collection("workspace").doc(invite.workId).update({
          team:firebase.firestore.FieldValue.arrayUnion(invite.receiver)
        }).then(async ()=>{
          
          const notifyList = this.authSV.notifyList.map(n=>{
            if(n.notifyId==notifyId)
              n.status = "Read";
            return n;
          });

          await this.afstore.collection("userProfile").doc(this.authSV.userId).update({
            notification: notifyList
          }).then(()=>{
            return true;
          }).catch(()=>{
            return false;
          });

        })
        .catch(()=>{
          return false;
        });

      }

      this.dialogSV.openMsgToast(`${invite.status} the Invitaion`,"success-toast");
      return true;

    }).catch(()=>{

      this.dialogSV.openMsgToast(`Something went wrong`,"error-toast");
      return false;

    });

  }

  getInviteDetails(invId:string):Observable<any>{
    return this.afstore.collection<InviteModel>(`invitation`).doc(invId).get().pipe(
      map(inv=>{return inv.data() || null})
    );
  }


  async inviteMmebers(users:UserModel[],wk:WorkspaceModel){

    let invite:InviteModel,flag:boolean=true;

    for (const element of users) {
       invite = {
         invId : this.afstore.createId(),
         createdOn : (new Date()).toISOString(),  
         status : "Pending",
         workId : wk.workId,
         workspaceName : wk.name,
         sender : wk.owner,
         receiver : element
       };

       console.log(invite);

       await this.afstore.collection('invitation').doc(invite.invId).set(invite).then(async(_res)=>{

         let notify:NotificationModel = {
           title :`Workspace Invitaion`,
           createdOn : (new Date()).toISOString(),
           description : `You got an invite request from ${wk.owner.username} to join ${wk.name}.`,
           status : "Unread",
           notifyId : this.afstore.createId(),
           type : "Invite",
           helperId : invite.invId
         };

         console.log(notify);

         await this.afstore.collection(`userProfile`).doc(invite.receiver.uid).update({
                   notification: firebase.firestore.FieldValue.arrayUnion(notify) }).then(()=>{
                     return true;
                   }).catch(()=>{
                     return false;
                   });

       })
       .catch(()=>{
         this.dialogSV.openMsgToast("Something Went Wrong","error-toast");
         flag = false;
         return false;
       });
    }

    this.dialogSV.openMsgToast("Invitation Send","success-toast");
    this.router.navigate(['/dashboard']);
    return true;

  }

  getAllInvites(workId:string):Observable<{pending:InviteModel[],accepted:InviteModel[]}>{
    return this.afstore.collection<InviteModel>("invitation",ref=>ref.where("workId","==",workId)).snapshotChanges().pipe(
                map(inv=>{
                  console.log(inv);
                  return inv.map(n=>n.payload.doc.data());
                }),
                map(invs=>{
                  let pending:InviteModel[] = invs.filter(inv=>inv.status==="Pending");
                  let accepted:InviteModel[] = invs.filter(inv=>inv.status==="Accepted");
                  console.log(invs,pending,accepted)
                  return {pending:pending,accepted:accepted};
                })
    ); 
  }

}
