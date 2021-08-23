import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  @Input()
  scene: Scene

  @Input()
  coordinate$ = new Subject<Coordinate>()

  isDrag = false

  @ViewChild("SceneElement", {static: false})
  sceneElement: ElementRef|undefined;

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {
    this.coordinate$
      .subscribe(coordinate => {
      if(this.isDrag) {
        this.scene.coordinate.x = coordinate.x
        this.scene.coordinate.y = coordinate.y
      }
    })
  }

  onClick(event) {
    this.isDrag = !this.isDrag
  }

  onmousedown(event) {
    if(this.isDrag) {
      const coordinate = new Coordinate()
      coordinate.x = event.x - 100
      coordinate.y = event.y - 200

      this.coordinate$.next(coordinate)
    }
    event.stopPropagation()
  }

}
