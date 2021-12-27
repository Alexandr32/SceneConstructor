import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panorama-controls',
  templateUrl: './panorama-controls.component.html',
  styleUrls: ['./panorama-controls.component.scss']
})
export class PanoramaControlsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  top() {
    //this.viewer.setPitch(this.viewer.getPitch() + 20);
  }

  topLeft() {
    //this.top()
    //this.left()
  }

  topRight() {
    //this.top()
    //this.right()
  }

  center() {
    //this.viewer.setPitch(0);
    //this.viewer.setYaw(0);
  }

  bottom() {
    //this.viewer.setPitch(this.viewer.getPitch() - 20);
  }

  bottomLeft() {
    //this.bottom()
    //this.left()
  }

  bottomRight() {
    //this.bottom()
    //this.right()
  }

  left() {
    //this.viewer.setYaw(this.viewer.getYaw() - 50);
  }

  right() {
    //this.viewer.setYaw(this.viewer.getYaw() + 50);
  }

}
