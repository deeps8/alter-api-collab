import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  wsMenuList:Array<string>;
  wsSelected:string = "all";

  constructor() {
    this.wsMenuList = [ "all","personal","team" ];
  }

  ngOnInit(): void {
  }

  selectMenuItem(item:string){
    console.log(item);
    this.wsSelected = item;
  }

}
