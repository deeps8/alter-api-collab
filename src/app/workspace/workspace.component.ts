import { I } from '@angular/cdk/keycodes';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CollectionModel } from '../models/collection.model';
import { ReqDialog } from '../models/req-dialog';
import { RequestModel } from '../models/request.mode';
import { WorkspaceModel } from '../models/workspace.model';
import { CollectionService } from '../services/collection/collection.service';
import { AddReqComponent } from './add-req/add-req.component';

interface FlatNode{
  expandable:boolean,
  name:string,
  level:number,
  id:string,
};

// may change on adding to firebase.
interface CollectionNode{
  name:string,
  id:string,
  children?:CollectionNode[]
};

interface Tabs{
  id:string,
  req:RequestModel,
}


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: []
})
export class WorkspaceComponent implements OnInit, OnDestroy {

  private _transformer = (node:CollectionNode,level:number)=>{
    return {
      expandable: !!node.children && node.children.length > 0,
      name:node.name,
      id:node.id,
      level:level
    }
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node =>node.level,
    node => node.expandable,
  );

  treeFlatter = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl,this.treeFlatter);

  wkTabs:Tabs[] = [];
  tabAdded:boolean = false;
  selectedIdx:number = 0;
  activeReqId:string = '';

  collection$!:Subscription;
  COLL_DATA:CollectionNode[] = [];
  colList:CollectionModel[] = [];

  currWorkspace!:Observable<WorkspaceModel | undefined>;
  currRequest!:RequestModel;

  constructor(private activeRoute:ActivatedRoute,
              private dialog:MatDialog,
              private colSV:CollectionService,
              private router:Router){ 
    
    this.dataSource.data = this.COLL_DATA;
    
    this.activeRoute.params.subscribe(p=>{
      this.currWorkspace = this.colSV.getWorkspace(p['wid']);
      this.collection$ = this.colSV.getAllCollections(p['wid']).subscribe(res=>{
          this.colList = res;
          this.COLL_DATA = res.map(r=>{
            return {
              id:r.colId,
              name:r.name,
              children:r.request.map(q=>{
                return {
                  id:q.reqId,
                  name:q.name,
                }
              })
            };
          });
          this.dataSource.data = this.COLL_DATA;
      });
    });

              // fetching the ids from url
              if(this.activeRoute.children.length!=0){
                this.activeRoute.children[0].params.subscribe(p=>{
                  if(!this.tabAdded){
                    if(p['id']!==''){
                      const req = this.getCollection(p['id']);
                      if(req!==null){
                        this.wkTabs.push({id:p['id'],req:this.getCollection(p['id'])});
                        this.activeReqId = p['id'];
                      }
                    }
                    // else{
                    //   let req = localStorage.getItem("last_req");
                    //   if(req!==null){
                    //     const r:RequestModel = JSON.parse(req);
                    //     this.router.navigate(['request',r.reqId],{relativeTo:this.activeRoute.parent});
                    //   }
                    // }
                  }
                }); 
              }

  }
  ngOnDestroy(): void {
    this.collection$.unsubscribe();
  }

  ngOnInit(): void {
  }

  hasChild = (_:number,node:FlatNode) => node.expandable;

  
  focusColl(id:string){
    document.getElementById(id)?.focus();
  }

  
  addTab(id:string,newReq:boolean=false){
    this.tabAdded = true;
    this.activeReqId = id;
    const req = this.getCollection(id);
    if(req!==null){
      this.wkTabs.push({id:id,req:this.getCollection(id)});
      this.selectedIdx++;
      if(newReq){
        this.router.navigate(['request',id],{relativeTo:this.activeRoute.parent});
      }
    }
  }


  onTabChanged(event:MatTabChangeEvent){
    const idx = event.index;
    if(idx===-1)
      return;
    this.activeReqId = this.wkTabs[idx].id;
    this.currRequest = this.wkTabs[idx].req;
    this.router.navigate(['request',this.wkTabs[idx].id],{relativeTo:this.activeRoute.parent});
  }


  removeTab(idx:number){
    this.wkTabs.splice(idx,1);
    // this.selectedIdx = 0;
  }

  openDialog(type:"req"|"both",colId:string,wkId:string){
    let dialogData:ReqDialog = {
      type:type,
      colId:colId,
      workId:wkId,
      colList:this.COLL_DATA
    };
    
    const addReqDialog = this.dialog.open(AddReqComponent,{
      autoFocus:true,
      minWidth:400,
      data:dialogData
    });

    addReqDialog.afterClosed().subscribe((res:{added:boolean,req:RequestModel})=>{
      if(res.added){
        localStorage.setItem("last_req",JSON.stringify(res.req));
        this.addTab(res.req.reqId,res.added);
      }
    });
  }

  openReq(id:string){
    this.activeReqId = id;
    const wkIdx = this.wkTabs.findIndex(t=>t.id===id);
    if(wkIdx === -1)
      this.addTab(id);
    else{
      this.selectedIdx = wkIdx;
    }     
  }

  getCollection(id:string):any{
    let idx,flag=false;
    for (const col of this.colList) {
      idx = col.request.findIndex(r=>r.reqId===id);
      if(idx>=0){
        this.currRequest = col.request[idx];
        localStorage.setItem("last_req",JSON.stringify(this.currRequest));
        localStorage.setItem("colId",col.colId);
        return this.currRequest;
      }
    }
    if(this.colList.length===0){
      console.log("local");
      let req = localStorage.getItem("last_req");
      if(req!==null ){
        this.currRequest = JSON.parse(req);
        if(this.currRequest.reqId === id)
          return this.currRequest;
        else
          return null;
      }
    }
  }

}
