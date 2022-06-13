import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { UserService } from 'src/app/services/user/user.service';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
})
export class InviteDialogComponent implements OnInit, OnDestroy{

  inviteForm:FormGroup;
  separatorKeysCodes = [COMMA, SPACE,ENTER];
  userList:Observable<UserModel[]>;
  users:UserModel[] = [];
  allUsers:UserModel[] = [];
  userSubs$:Subscription;

  workList:WorkspaceModel[] = [];

  loading:boolean = false;

  @ViewChild('inviteInput')
  inviteInput!: ElementRef;
  
  constructor(private dialogRef:MatDialogRef<InviteDialogComponent>,
              private userSV:UserService,
              private workSV:WorkspaceService) {

                this.workList = workSV.workList;

                this.inviteForm = new FormGroup({
                  workId: new FormControl('',[Validators.required]),
                  email: new FormControl('',),
                  users: new FormControl([this.users],[Validators.required])
                });

                this.userList = this.inviteForm.controls['email']?.valueChanges.pipe(
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
  }
  

  closeDig(){
    this.dialogRef.close("cancelled");
  }

  async submit(){
    this.loading = true;
    // console.log(this.inviteForm.value);
    const wkid:string = this.inviteForm.value.workId;
    const idx:number = this.workList.findIndex(wk=>wk.workId===wkid);
    if(idx>=0){
      // console.log(this.workList[idx]);
      await this.workSV.inviteMmebers(this.users,this.workList[idx]);
      this.loading = false;
      this.dialogRef.close("submitted");

    }
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

    this.inviteForm.controls['email'].setValue('');
    // console.log("Add ");
  }

  selected(event: MatAutocompleteSelectedEvent){
    // console.log(event)
    
    this.remove(event.option.value);
    const idx:number = this.allUsers.findIndex(u=>u.email===event.option.value);
    if(idx>=0)
        this.users.push(this.allUsers[idx]);

    this.inviteInput.nativeElement.value = '';
    this.inviteForm.controls['email'].setValue('');
  }

  filter(user:string){
    return this.allUsers.filter(us=>us.email?.toLowerCase().indexOf(user.toLowerCase()) === 0);
  }

  remove(user:any){

    const idx = this.users.findIndex(s=>s.email===user);
    if(idx>=0)
      this.users.splice(idx,1);
      
  }

}
