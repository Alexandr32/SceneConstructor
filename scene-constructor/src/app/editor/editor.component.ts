import { Component, OnInit } from '@angular/core';
import {Scene} from '../models/scene-model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  scene: Scene

  constructor() {
    this.scene = new Scene()
    this.scene.id = 1
    this.scene.text = 'Text'
    this.scene.title = 'title'
  }

  ngOnInit() {
  }

}
