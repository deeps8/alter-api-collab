import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { WorkspaceService } from 'src/app/services/workspace/workspace.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  wsMenuList:Array<string>;
  wkSelected:string = "All";
  workList:WorkspaceModel[] = [];
  workspace:WorkspaceModel[] = [];
  load:boolean = true;

  constructor(public workSV:WorkspaceService) {
    this.wsMenuList = [ "All","Personal","Team" ];
    workSV.getAllWorkspace().subscribe(res=>{
      this.workList = res;
      this.workspace = res;
      this.load = false;
    });
  }

  ngOnInit(): void {

  }

  selectMenuItem(item:string){
    // console.log(item);
    this.wkSelected = item;
    // filter the workList
    this.workList = this.workspace.filter(wk=>{
      if(this.wkSelected==="All")
        return true;
      else return wk.type===this.wkSelected;
    });
  }

}
