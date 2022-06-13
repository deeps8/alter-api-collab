import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afauth: AngularFireAuth,
              private afstore: AngularFirestore,
              private authSV: AuthService) {
    
  }

  getAllUsers():Observable<UserModel[]>{

    return this.afstore.collection<UserModel>('userProfile',ref=>ref.where("uid","!=",this.authSV.userId)).stateChanges().pipe(
      map(users=>{
        return users.map(u=>{
          let user:UserModel = {
                  email:u.payload.doc.data().email,
                  uid:u.payload.doc.data().uid,
                  username:u.payload.doc.data().username
                }
          return user;
        })
      }),
      catchError(()=>{
        return throwError(() => new Error("Get All User Error"));
      })
    );

  }
}
