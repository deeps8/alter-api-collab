import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionModel } from 'src/app/models/collection.model';
import { ReqDialog } from 'src/app/models/req-dialog';
import { RequestModel } from 'src/app/models/request.mode';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CollectionService } from 'src/app/services/collection/collection.service';

@Component({
  selector: 'app-add-req',
  templateUrl: './add-req.component.html',
})
export class AddReqComponent implements OnInit {


  reqAddForm:FormGroup;
  colMethod:boolean = true;

  loading:boolean = false;

  constructor(private dialogRef:MatDialogRef<AddReqComponent>,
              private authSV: AuthService,
              private colSV: CollectionService,
              @Inject(MAT_DIALOG_DATA) public data: ReqDialog) {
                

                this.reqAddForm = new FormGroup({
                  colId: new FormControl(data.colId,[]),
                  colName: new FormControl('',[]),
                  wkId: new FormControl(data.workId,[Validators.required]),
                  reqName: new FormControl('',[Validators.required])
                });

                this.changeInput(true);
  }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close({added:false,req:null});
  }

  async submit(){
    this.loading = true;

    if(this.colMethod){
      // add the request into existing collection
      let req:RequestModel = {
        createdOn: (new Date()).toISOString(),
        creator: this.authSV.user,
        name: this.reqAddForm.controls['reqName'].value,
        method: "GET",
        reqBody:'',
        reqId:'',
        url:''
      };
  
      if(this.data.type==="req"){
        await this.colSV.addRequestWithColId(req,this.data.colId,this.data.workId);
      }
      else{
        await this.colSV.addRequestWithColId(req,this.reqAddForm.controls['colId'].value,this.data.workId);
      }
      this.loading = false;
      this.dialogRef.close({added:true,req:req})
    }else{
      let col:CollectionModel = {
        colId:'', //need to be created in colService
        createdOn:(new Date()).toISOString(),
        creater:this.authSV.user,
        name:this.reqAddForm.controls['colName'].value,
        workId:this.data.workId,
        request:[
          {
            createdOn:(new Date()).toISOString(),
            creator:this.authSV.user,
            method:'GET',
            name:this.reqAddForm.controls['reqName'].value,
            reqBody:'',
            reqId:'', //need to be created in colService
            url:''
          }
        ]
      };

      await this.colSV.addColWithReq(col);
      this.loading = false;
      this.dialogRef.close({added:true,req:col.request[0]})
    }
  }

  changeInput(type:boolean){
    this.colMethod = type;
    if(type){
      this.reqAddForm.controls['colId'].addValidators([Validators.required]);
      this.reqAddForm.controls['colName'].clearValidators();
    }
    else{
      this.reqAddForm.controls['colId'].clearValidators();
      this.reqAddForm.controls['colName'].addValidators([Validators.required]);
    }
    this.reqAddForm.controls['colId'].updateValueAndValidity();
    this.reqAddForm.controls['colName'].updateValueAndValidity();
  }

}
