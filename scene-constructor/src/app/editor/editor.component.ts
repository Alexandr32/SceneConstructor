import { Component, OnInit } from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, of, Subject} from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  scene: Scene

  coordinate$ = new Subject<Coordinate>()

  constructor() {
    this.scene = new Scene()
    this.scene.id = 1
    this.scene.text = 'Text'
    this.scene.title = 'title'
  }

  ngOnInit() {
  }

  onmousemove(event) {
    const el = event.target as HTMLDivElement
    if(el.classList.contains('editor--working-space')) {
      const coordinate = new Coordinate()
      coordinate.x = event.layerX
      coordinate.y = event.layerY
      this.coordinate$.next(coordinate)
    }
  }

}
