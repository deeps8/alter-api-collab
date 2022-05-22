import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';

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
  name:string,
}

const COLL_DATA:CollectionNode[] = [
  {
    name:"User-Auth",
    id:"u1",
    children:[{name:"Login Request",id:"u1-1"},{name:"Register Request",id:"u1-2"}]
  },
  {
    name:"User-Profile",
    id:"u2",
    children:[{name:"User Profile Details",id:"u2-1"},{name:"User Posts",id:"u2-2"}]
  },
  {
    name:"Post-CRUD",
    id:"p3",
    children:[{name:"Post Details",id:"u2-1"},{name:"Posts Delete",id:"u2-2"}]
  }
];

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: []
})
export class WorkspaceComponent implements OnInit {

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
  constructor(private activeRoute:ActivatedRoute, private router:Router){ 
    
    // later on set this dataSource with fetched data.
    this.dataSource.data = COLL_DATA;

    console.log("Conc")
    // fetching the ids from url
    this.activeRoute.params.subscribe(p=>{
      if(!this.tabAdded){
        console.log(p['id']);
        if(p['id'] !== undefined){
          this.wkTabs.push({id:p['id'],name:'Request'});
        }
        else{
          this.wkTabs.push({id:'wk-id',name:'Overview'});
        }
      }
    });

  }

  ngOnInit(): void {
  }

  hasChild = (_:number,node:FlatNode) => node.expandable;

  
  focusColl(id:string){
    document.getElementById(id)?.focus();
  }

  
  addTab(id:string){
    const rid = (Math.random()*10).toFixed().toString();
    this.tabAdded = true;
    this.wkTabs.push({id:rid,name:'Request'});
    this.selectedIdx++;
  }


  onTabChanged(event:MatTabChangeEvent){
    const idx = event.index;
    this.router.navigate(['request',this.wkTabs[idx].id],{relativeTo:this.activeRoute.parent,replaceUrl:true});
  }


  removeTab(idx:number){
    this.wkTabs.splice(idx,1);
  }

}
