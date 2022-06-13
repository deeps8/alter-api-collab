import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MonacoEditorConstructionOptions } from '@materia-ui/ngx-monaco-editor';
import { Subscription, Observable } from 'rxjs';
import { CollectionModel } from 'src/app/models/collection.model';
import { RequestModel } from 'src/app/models/request.mode';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { CollectionService } from 'src/app/services/collection/collection.service';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit {

  jsonData = JSON.stringify(`
  {
    "hosting": [
      {
        "target": "app",
        "public": "www",
        "ignore": [
          "**/.*"
        ],
        "headers": [
          {
            "source": "*.[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f].+(css|js)",
            "headers": [
              {
                "key": "Cache-Control",
                "value": "public,max-age=31536000,immutable"
              }
            ]
          }
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    ]
  }
  `);
  editorOptions: MonacoEditorConstructionOptions = {
		theme: 'vs-light',
		language: 'json',
    readOnly:true,
    lineNumbers:'off',
    folding:true,
    fontSize:13
  };

  collection$!:Subscription;
  colList:CollectionModel[] = [];

  currWorkspace!:Observable<WorkspaceModel | undefined>;
  
  constructor(private activeRoute:ActivatedRoute,
    private dialog:MatDialog,
    private colSV:CollectionService,
    private router:Router) { 
    this.activeRoute.params.subscribe(p=>{
      this.currWorkspace = this.colSV.getWorkspace(p['wid']);
      this.collection$ = this.colSV.getAllCollections(p['wid']).subscribe(res=>{
          this.colList = res;
      });
    });
  }

  ngOnInit(): void {
    this.jsonData = JSON.parse(this.jsonData);
  }

}
