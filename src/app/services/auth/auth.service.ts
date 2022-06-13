import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, of, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NotificationModel } from 'src/app/models/notification.model';
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorMsgReg:string = '';
  errorMsgLog:string = '';
  testData:string = "";

  loadingStatus:boolean = false;

  // TODO : create the models for user
  user$:Observable<any>;
  userId:string|undefined;
  user!: UserModel;
  notifyIndicator:boolean = false;

  notifyList:NotificationModel[] = [];

  constructor(private afauth: AngularFireAuth,
              private afstore: AngularFirestore,
              private router: Router) {

      this.userId = localStorage.getItem('uid') || undefined;      
      
      this.user$ = this.afauth.authState.pipe(
        switchMap(user=>{
          if(user){
            return this.afstore.doc<UserModel>(`userProfile/${user.uid}`).valueChanges().pipe(
              map(res=>{
                delete res?.notification;
                return res;
              })
            );
          }else{
            //logged out
            return of(null);
          }
        })
        );

      this.user$.subscribe(res=>{
        this.user = res;
      });
  }

  async setUserId(){
    this.userId = await this.afauth.currentUser.then(u=>{
      console.log(u?.uid);
      return u?.uid;
    });
  }


  getData(){
    return this.testData;
  }

  setData(d:string){
    this.testData = d;
  }

  async login(userDetails:any){
    this.errorMsgLog = '';
    this.loadingStatus = true;
    await this.afauth.signInWithEmailAndPassword(userDetails.email,userDetails.password)
              .then((res:firebase.auth.UserCredential)=>{
                this.loadingStatus = false;
                this.userId = res.user?.uid;
                let initials:string = res.user?.email?.split('@')[0][0] || "P";
                localStorage.setItem('initials',initials);
                localStorage.setItem('uid',this.userId || '');

                this.router.navigate(['/dashboard']);
              })
              .catch((reason:any)=>{
                this.loadingStatus = false;
                if(reason.code === "auth/user-not-found"){
                  this.errorMsgLog = "User not found";
                }
                else if(reason.code === "auth/wrong-password"){
                  this.errorMsgLog = "Wrong Password";
                }
              });
  }


  async register(userDetails:any){
      this.errorMsgReg = '';
      this.loadingStatus = true;
      await this.afauth.createUserWithEmailAndPassword(userDetails.email,userDetails.password)
                .then(async (value:firebase.auth.UserCredential)=>{

                  //logged in
                  // console.log(value);
                  this.loadingStatus = false;
                  this.userId = value.user?.uid;
                  localStorage.setItem('uid',this.userId || '');
                  // saving the user creds
                  await this.afstore.doc(`userProfile/${value.user?.uid}`)
                        .set({email:value.user?.email, username:userDetails.username, uid:value.user?.uid,notification:[]})
                        .then(_res=>{
                          // navigate to the dashboard.
                          this.router.navigate(['/dashboard']);
                        })
                        .catch((error:any)=>{
                          // show that error msg in signup page
                          console.log(error);
                        });
                })
                .catch((reason:any)=>{
                  this.loadingStatus = false;
                  // populating the error msg
                  if(reason.code === "auth/email-already-in-use"){
                    this.errorMsgReg = "Email already in use."
                  }
                  // console.log(reason.code,reason.message,reason.name);
                });
  }

  async logout(){
    try {
      await this.afauth.signOut().then(_res=>{
        console.log("Logging Out");
        this.router.navigate(['/auth','signin']);
        localStorage.removeItem('initials');
        localStorage.removeItem('uid');
      })
      .catch(error=>{
        console.log(error);
      });
    } catch (_error) {
      console.log("Error");
    }
  }


  // async getNotifications():Promise<NotificationModel | Error>{
    getNotifications():Observable<Array<NotificationModel>>{
      this.setUserId();
      console.log(this.userId);
      
      if(this.userId===undefined)
        return of([]);

      return this.afstore.collection<UserModel>('userProfile').doc(this.userId).snapshotChanges().pipe(
          map(nt=>{
              let data:NotificationModel[] = nt.payload.get('notification');
              let redFlag = false;
              if(data === undefined)
                return [];
                
              data.map(d=>{
                if(d.status==="Unread"){
                  this.notifyIndicator = true;
                  redFlag = true;
                  return;
                }
              })

              if(!redFlag){
                this.notifyIndicator = false;
              }
              
              data = data.sort((a,b)=>{
                return (new Date(b.createdOn)).valueOf() - (new Date(a.createdOn)).valueOf();
              });
              this.notifyList = data;
              return data || [];
          })
      );
  }


}
