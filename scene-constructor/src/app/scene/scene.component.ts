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

  positionX: number = 0
  positionY: number = 0

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {

    console.log(this.elementRef.nativeElement.parentElement);

    this.coordinate$
      .subscribe(coordinate => {

      console.log(coordinate);

      if(this.isDrag) {

        //this.sceneElement.nativeElemen..pageX = coordinate.x


        this.positionX = coordinate.x
        this.positionY = coordinate.y
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
