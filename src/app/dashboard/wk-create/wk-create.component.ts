import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-wk-create',
  templateUrl: './wk-create.component.html',
  styleUrls: []
})
export class WkCreateComponent implements OnInit {

  createWorkspace:FormGroup;
  separatorKeysCodes = [COMMA, SPACE,ENTER];
  userList:Observable<string[]> | undefined;
  users:string[] = [];
  allUsers:string[] = ['Deepak','Vivek','Ashish','Sam','Dipesh'];

  @ViewChild('inviteInput')
  inviteInput!: ElementRef;


  constructor() {
    this.createWorkspace = new FormGroup({
      name:new FormControl('',[Validators.required,Validators.minLength(6)]),
      summary: new FormControl('',[Validators.required,Validators.minLength(6)]),
      type: new FormControl('',[Validators.required]),
      invites : new FormControl(''),
      emails: new FormControl([this.users],[Validators.required])
    });


    this.userList = this.createWorkspace.controls['invites']?.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>(user ? this.filter(user) : []))
    );

  }


  ngOnInit(): void {
  }

  createWk(form:FormGroup){
    form.controls['emails'].setValue(this.users);
    console.log(form.value);
  }

  inputFieldValidation(form:FormGroup,fcname:string,type:string){
    return form.get(fcname)?.hasError(type);
  }

  add(event:MatChipInputEvent){

    const input = event.chipInput?.inputElement;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.users.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.createWorkspace.controls['invites'].setValue('');
    console.log("Add ");
  }

  selected(event: MatAutocompleteSelectedEvent){
    console.log(event)
    this.users.push(event.option.value);
    this.inviteInput.nativeElement.value = '';
    this.createWorkspace.controls['invites'].setValue('');
  }

  filter(user:string){
    return this.allUsers.filter(us=>us.toLowerCase().indexOf(user.toLowerCase()) === 0);
  }

  remove(user:any){
    const idx = this.users.findIndex(s=>s==user);
    if(idx>=0)
      this.users.splice(idx,1);
      
  }

}
