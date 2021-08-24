import { Component, OnInit } from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, of, Subject} from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  scenes: Scene[] = []

  constructor() {
    const scene1 = new Scene()
    scene1.id = 1
    scene1.text = 'Text'
    scene1.title = 'title'
    scene1.coordinate = new Coordinate()

    const scene2 = new Scene()
    scene2.id = 2
    scene2.text = 'Text2'
    scene2.title = 'title2'
    scene2.coordinate = new Coordinate()
    scene2.coordinate.y = 100
    scene2.coordinate.x = 140

    this.scenes.push(scene1, scene2)
  }

  ngOnInit() {
  }

  selectVariant(scene: Scene) {
    console.log(scene);
  }

}
