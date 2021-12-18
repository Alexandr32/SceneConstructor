import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  _src: string

  @Input()
  set src(value: string) {

    console.log('src')

    this._src = value

    this.changeDetection.detectChanges()
  }

  get src(): string {
    return this._src
  }

  constructor(private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  play() {
    this.changeDetection.detectChanges()
    this.videoPlayer.nativeElement.muted = true
    this.videoPlayer.nativeElement.play();
  }

}
