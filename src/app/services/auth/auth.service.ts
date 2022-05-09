import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { first, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorMsgReg:string = '';
  errorMsgLog:string = '';

  loadingStatus:boolean = false;

  // TODO : create the models for user
  user$:Observable<any>;

  constructor(private afauth: AngularFireAuth,
              private afstore: AngularFirestore,
              private router: Router) {

      this.user$ = this.afauth.authState.pipe(
        switchMap(user=>{
          if(user){
            return this.afstore.doc<any>(`userProfile/${user.uid}`).valueChanges();
          }else{
            //logged out
            return of(null);
          }
        })
      );

  }

  async login(userDetails:any){
    this.errorMsgLog = '';
    this.loadingStatus = true;
    await this.afauth.signInWithEmailAndPassword(userDetails.email,userDetails.password)
              .then((res:firebase.auth.UserCredential)=>{
                this.loadingStatus = false;

                let initials:string = res.user?.email?.split('@')[0][0] || "P";
                localStorage.setItem('initials',initials);

                this.router.navigate(['/dashboard']);
              })
              .catch((reason:any)=>{
                this.loadingStatus = false;
                if(reason.code === "auth/user-not-found"){
                  this.errorMsgLog = "User not found";
                }
                else if(reason.code === "auth/wrong-password"){
                  this.errorMsgLog = "Wrong Passord";
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
                  // saving the user creds
                  await this.afstore.doc(`userProfile/${value.user?.uid}`)
                        .set({email:value.user?.email, username:userDetails.username, uid:value.user?.uid})
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
      })
      .catch(error=>{
        console.log(error);
      });
    } catch (_error) {
      console.log("Error");
    }
  }


}
