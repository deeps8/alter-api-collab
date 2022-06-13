import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { AuthService } from '../auth/auth.service';
import { DialogService } from '../dialog/dialog.service';
import { CollectionModel } from 'src/app/models/collection.model';
import firebase from 'firebase/compat/app';
import { RequestModel } from 'src/app/models/request.mode';

import axios from 'axios';
import * as prettyBytes from 'pretty-bytes';
import { StatusCode } from 'src/app/models/status.code';

export interface Response{
    statusCode: string,
    timeTaken: string,
    size: string,
    body: string,
    header: object,
}

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  collectionList:CollectionModel[] = [];
  colChange$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private afstore:AngularFirestore,
              private authSV:AuthService,
              private dialogSV:DialogService) { 

  }


  getWorkspace(wkId:string):Observable<WorkspaceModel | undefined>{
    
    return this.afstore.collection<WorkspaceModel>("workspace").doc(wkId).snapshotChanges().pipe(
                map(wk=>{
                    return wk.payload.data();
                })
    );

  }


  async addColWithReq(col:CollectionModel){
    col.colId = this.afstore.createId();
    col.request[0].reqId = this.afstore.createId();
    // console.log(col);

    await this.afstore.collection("collection").doc(col.colId).set(col).then(async()=>{
      
      await this.afstore.collection("workspace").doc(col.workId).update({
        collectionCount: firebase.firestore.FieldValue.increment(1),
        requestCount: firebase.firestore.FieldValue.increment(1)
      }).then(()=>{
        return true;
      }).catch(()=>{
        return false;
      })

      this.dialogSV.openMsgToast("Collection Added","success-toast");
      return true;
    })
    .catch(error=>{
      this.dialogSV.openMsgToast("Something Went Wrong","error-toast");
      return false;
    });
  }

  getAllCollections(workId:string):Observable<CollectionModel[]>{
    
    return this.afstore.collection<CollectionModel>("collection",ref=>ref.where("workId","==",workId)).snapshotChanges().pipe(
                map(col=>{
                  this.collectionList = col.map(c=>{
                    return c.payload.doc.data();
                  });
                  console.log(this.collectionList);
                  this.colChange$.next(true);
                  return this.collectionList;
                })
    );

  }


  async addRequestWithColId(req:RequestModel,colId:string,workId:string){
    req.reqId = this.afstore.createId();
    await this.afstore.collection("collection").doc(colId).update({
      request:firebase.firestore.FieldValue.arrayUnion(req)
    })
    .then(async()=>{

      await this.afstore.collection("workspace").doc(workId).update({
        requestCount: firebase.firestore.FieldValue.increment(1)
      }).then(()=>{
        return true;
      }).catch(()=>{
        return false;
      });

      this.dialogSV.openMsgToast("Request Added","success-toast");
      return true;

    })
    .catch(()=>{

      this.dialogSV.openMsgToast("Something Went Wrong","error-toast");
      return false;
    })
  }


  getRequest(reqId:string):RequestModel | undefined{

    for (const col of this.collectionList) {
      const idx = col.request.findIndex(r=>r.reqId===reqId);
      if(idx>=0){
        return col.request[idx];
      }
    }

    return undefined;
  }


  async simulateRequest(req:any):Promise<Response | any>{

    let reqBody,response:any;
    let dataToShow!:Response;
    try {
      reqBody = JSON.parse(req.data);
    } catch (error) {
      this.dialogSV.openMsgToast("JSON data is malformed","error-toast")
      // return req;
      return dataToShow;
    }

    let startTime = new Date().getTime();
    return await axios({
      url: req.url,
      method: req.method,
      params: req.params,
      headers: req.headers,
      data: reqBody
    })
    .catch(e =>{
        // console.log(e);
        // this.dialogSV.openMsgToast(e.response,"error-toast")
        return e.response;
    })
    .then(res=> {
        res.timeTaken = new Date().getTime() - startTime - 10;
        // if(res.timeTaken)
        // req.response?.time = res.timeTaken.toString();
        
        res.size = prettyBytes.default(
          JSON.stringify(res.data).length + JSON.stringify(res.headers).length
        );

        response = res;
        console.log(res);

        if(response.timeTaken >= 1000){
          response.timeTaken = (response.timeTaken / 1000) + " s";
        }else{
          response.timeTaken = response.timeTaken + " ms";
        }
  
        const scIdx:number =StatusCode.findIndex(sc=>sc.status===response.status.toString());
        
        dataToShow = {
          statusCode : `${response.status} ${StatusCode[scIdx].message}`,
          timeTaken : response.timeTaken,
          size : response.size,
          body : JSON.stringify(response.data,null," "),
          header : response.headers
        }
  
        // console.log(dataToShow);
  
        return dataToShow;

    });


  }


  async setRequest(req:RequestModel){
    let colId:string = '';
    for (const col of this.collectionList) {
      const idx:number = col.request.findIndex(r=>r.reqId === req.reqId);
      if(idx>=0){
        col.request[idx] = req;
        colId = col.colId;
        await this.afstore.collection("collection").doc(colId).set(col).then(res=>{
          return true;
        }).catch(()=>{
          return false;
        })
        return;
      }
    }
    console.log(this.collectionList,colId);
  }

}
