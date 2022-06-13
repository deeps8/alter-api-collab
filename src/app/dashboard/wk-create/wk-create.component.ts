import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/models/user.model';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';
import { InviteModel } from 'src/app/models/invite.model';


@Component({
  selector: 'app-wk-create',
  templateUrl: './wk-create.component.html',
  styleUrls: []
})
export class WkCreateComponent implements OnInit , OnDestroy{

  createWorkspace:FormGroup;
  separatorKeysCodes = [COMMA, SPACE,ENTER];
  userList:Observable<UserModel[]>;
  users:UserModel[] = [];
  allUsers:UserModel[] = [];
  userSubs$:Subscription;

  @ViewChild('inviteInput')
  inviteInput!: ElementRef;

  load:boolean = false;


  constructor(private userSV:UserService,
              private authSV:AuthService,
              private workSV:WorkspaceService
              ) {

    this.createWorkspace = new FormGroup({
      name:new FormControl('',[Validators.required,Validators.minLength(6)]),
      summary: new FormControl('',[Validators.required,Validators.minLength(6)]),
      type: new FormControl('Team',[Validators.required]),
      invites : new FormControl(''),
      emails: new FormControl([this.users],[Validators.required])
    });


    this.userList = this.createWorkspace.controls['invites']?.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>(user ? this.filter(user) : []))
    );

    this.userSubs$ = this.userSV.getAllUsers().subscribe(users=>{
      this.allUsers = users;
      // console.log(this.allUsers);
    });

  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubs$.unsubscribe();
    // console.log("Add Workspace Destroyed")
  }

  async createWk(form:FormGroup){
    form.controls['emails'].setValue(this.users);

    let workspace:WorkspaceModel = {
      name: form.value.name,
      summary: form.value.summary,
      type: form.value.type,
      owner: this.authSV.user,
      createdOn: (new Date()).toISOString(),
      team: [this.authSV.user],
      collectionCount: 0,
      requestCount: 0,
      workId: ''
    };

    // console.log(workspace);
    
    form.reset();
    form.controls['type'].setValue("Team");
    this.load = true;
    this.load = await this.workSV.addWorkspace(workspace,this.users);
  }

  inputFieldValidation(form:FormGroup,fcname:string,type:string){
    return form.get(fcname)?.hasError(type);
  }

  add(event:MatChipInputEvent){

    const input = event.chipInput?.inputElement;
    const value = event.value;

    // Add our fruit
    this.remove(value);
    if ((value || '').trim()) {
      const idx:number = this.allUsers.findIndex(u=>u.email===value);
      if(idx>=0)
        this.users.push(this.allUsers[idx]);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.createWorkspace.controls['invites'].setValue('');
    // console.log("Add ");
  }

  selected(event: MatAutocompleteSelectedEvent){
    // console.log(event)
    
    this.remove(event.option.value);
    const idx:number = this.allUsers.findIndex(u=>u.email===event.option.value);
    if(idx>=0)
        this.users.push(this.allUsers[idx]);
  
    this.inviteInput.nativeElement.value = '';
    this.createWorkspace.controls['invites'].setValue('');
  }

  filter(user:string){
    return this.allUsers.filter(us=>us.email?.toLowerCase().indexOf(user.toLowerCase()) === 0);
  }

  remove(user:string){
    const idx = this.users.findIndex(s=>s.email===user);
    if(idx>=0)
      this.users.splice(idx,1);
      
  }

}
