import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MonacoEditorComponent, MonacoEditorConstructionOptions } from '@materia-ui/ngx-monaco-editor';
import { Subscription } from 'rxjs';
import { RequestModel } from 'src/app/models/request.mode';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CollectionService } from 'src/app/services/collection/collection.service';

export interface KeyValue{
  key:string,
  value:string;
};

@Component({
  selector: 'app-wk-tab',
  templateUrl: './wk-tab.component.html',
})
export class WkTabComponent implements OnInit,OnDestroy {
  
  @Input() req!:RequestModel;

  @ViewChild(MonacoEditorComponent, { static: false })
  monacoComponent: MonacoEditorComponent | undefined;

  testData:string = "Deepak";
  colChange$!:Subscription;

  requestForm!: FormGroup;
  queryParams:Array<KeyValue> = [{
    key:"",
    value:""
  }];

  reqHeaders:Array<KeyValue> = [{
    key:"",
    value:""
  }];

  reqData:string = "{}";


  cookies:Array<KeyValue> = [];

  resHeaders:Array<KeyValue> = [];

  resData!:string;

  editorOptions: MonacoEditorConstructionOptions = {
		theme: 'vs-light',
		language: 'json',
		roundedSelection: true,
		autoIndent: "keep",
    acceptSuggestionOnEnter:"smart",
    automaticLayout: true,
    codeLens:true,
    contextmenu:true,
    copyWithSyntaxHighlighting:true,
    detectIndentation:true,
    folding:true,
    fontSize:13,
    matchBrackets:"always",
    tabCompletion:"on",
  };

  resEditorOptions: MonacoEditorConstructionOptions = {
		theme: 'vs-light',
		language: 'json',
    readOnly: true,
		roundedSelection: true,
		autoIndent: "keep",
    acceptSuggestionOnEnter:"smart",
    automaticLayout: true,
    codeLens:true,
    contextmenu:true,
    copyWithSyntaxHighlighting:true,
    detectIndentation:true,
    folding:true,
    fontSize:13,
    matchBrackets:"always",
    tabCompletion:"on",
  };

  timeTaken!:string;
  status!:string;
  resSize!:string;

  simulating:boolean = false;

  constructor(private authsv: AuthService,
              private colSV: CollectionService) { 


    this.authsv.setData(this.testData);

  }
  ngOnDestroy(): void {
    this.colChange$.unsubscribe();
  }

  ngOnInit(): void {
    this.colChange$ = this.colSV.colChange$.subscribe(res=>{
      console.log(res);
      const r = this.colSV.getRequest(this.req.reqId);

      this.initValues(r);

    });
  }


  initValues(r:any){
    console.log("R : ",r);
    if(r)
        this.req = r;

      if(this.req.reqParams !== undefined)
        this.queryParams = this.req.reqParams;

      if(this.req.reqHeaders !== undefined)
        this.reqHeaders = this.req.reqHeaders;

      if(this.req.response?.cookies !== undefined)
        this.cookies = this.req.response.cookies;

      if(this.req.response?.resHeaders !== undefined)
        this.resHeaders = this.req.response.resHeaders;

      if(this.req.response?.time !== undefined)
        this.timeTaken = this.req.response.time;

      if(this.req.response?.status !== undefined)
        this.status = this.req.response.status;

      if(this.req.response?.size !== undefined)
        this.resSize = this.req.response.size;
      
      // console.log(this.req);
      this.requestForm = new FormGroup({
        method : new FormControl(this.req.method,[Validators.required]),
        url : new FormControl(this.req.url,[Validators.required]),
        params : new FormControl(this.queryParams,[]),
        headers : new FormControl(this.reqHeaders,[]),
        body: new FormControl(this.req.reqBody,[])
      });

      if(this.req.reqBody!==undefined && this.req.reqBody!=="")
        this.reqData = this.req.reqBody;
    
      if(this.req.response?.resBody!==undefined)
        this.resData = this.req.response?.resBody;
  }

  removeParams(index:number,arr:KeyValue[]){
    if(arr)
      arr.splice(index,1);
  }

  addParams(arr:KeyValue[]){
    if(arr)
      arr.push({
        key:"",value:""
      });
  }

  async sendRequest(){
    this.simulating = true;
    console.log(this.requestForm.value);

    this.queryParams = this.queryParams.filter(p => p.key.trim() != "" && p.value.trim() != "");
    this.reqHeaders = this.reqHeaders.filter(h => h.key.trim() != "" && h.value.trim() != "");
    // this.requestForm.controls["params"].patchValue({params:this.queryParams,headers:this.reqHeaders});

    let pr = Object({});
    this.queryParams.map(p=>{
      pr[p.key]=p.value;
    });

    let hr = Object({});
    this.reqHeaders.map(h=>{
      hr[h.key]=h.value;
    });

    hr["Access-Control-Allow-Origin"] = "*";
    hr["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, PATCH";

    this.req.url = this.requestForm.controls['url'].value;
    this.req.method = this.requestForm.controls['method'].value;
    this.req.reqBody = this.reqData;
    this.req.reqParams = this.queryParams;
    this.req.reqHeaders = this.reqHeaders;

    let apiData = Object({
      url:this.requestForm.controls['url'].value,
      method:this.requestForm.controls['method'].value,
      params:pr,
      headers:hr,
      data: this.reqData,
    });

    console.log(apiData);
    await this.colSV.simulateRequest(apiData).then(async (res:any)=>{
      if(this.req.response === undefined){
        this.req.response = {};
      }
      if(res!=undefined && this.req.response !== undefined){
        this.req.response.resBody = res.body;
        this.req.response.size = res.size;
        this.req.response.time = res.timeTaken;
        this.req.response.status = res.statusCode;
        
        let headers:KeyValue[] = [];
        for (const h in res.header) {
          headers.push({value:res.header[h],key:h});
        }
        this.req.response.resHeaders = headers;
        
        // console.log(this.req.response);
        await this.colSV.setRequest(this.req);
        this.initValues(this.req);
        this.simulating = false;
      }
    }).catch(e=>{
      // console.log("Eror Sim",e);
    })
    ;
  }

}
