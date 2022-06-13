import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authType:string | undefined;
  signinForm!:FormGroup;
  signupForm!:FormGroup;

  constructor(private route: ActivatedRoute,
              public authSV: AuthService ) {
    // console.log(authSV.getData);
    // signin form
    this.signinForm = new FormGroup({
      email : new FormControl('',[Validators.required,Validators.email]),
      password : new FormControl('',[Validators.required,Validators.minLength(6)])
    });

    // signup form
    this.signupForm = new FormGroup({
      email : new FormControl('',[Validators.required,Validators.email]),
      username : new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
      password : new FormControl('',[Validators.required,Validators.minLength(6)]),
      confirmPassword : new FormControl('',[Validators.required,Validators.minLength(6)])
    });

    this.route.params.subscribe(p=>{
      this.authType = p['type'];
      this.signinForm.reset({email:'',password:''});
      this.signupForm.reset({email:'',password:'',confirmPassword:'',username:''});
      this.authSV.errorMsgLog = '';
      this.authSV.errorMsgReg = '';
      this.authSV.loadingStatus = false;
    });


  }

  ngOnInit(): void {
  }

  inputFieldValidation(form:FormGroup,fcname:string,type:string){
    return form.get(fcname)?.hasError(type);
  }

  passwordCheck(formValue:any){
    if(formValue.password && formValue.confirmPassword && formValue.password !== formValue.confirmPassword)
      return true;
    else return false;
  }

  signIn(form:FormGroup){
    // calling for the auth service login function
    this.authSV.login(form.value);
    this.signinForm.reset({email:'',password:''});
  }

  signUp(form:FormGroup){
    // calling for the auth service funciton register
      this.authSV.register(form.value);
      this.signupForm.reset({email:'',password:'',confirmPassword:'',username:''});
  }

}
