import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {IBaseSceneRunGame} from '../models/other-models/base-scene-run-game.model';
import {StoreRunGameService} from "../services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {FileLink} from "../../core/models/file-link.model.ts";
import {BehaviorSubject, Observable, of} from "rxjs";

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent extends BaseComponent implements OnInit, OnDestroy {

  selectScene: IBaseSceneRunGame

  private soundUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('')

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private storeRunGameService: StoreRunGameService
  ) {
    super()
  }


  async ngOnInit() {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.selectScene = currentScene

        console.log(currentScene)

        this.soundUrl$.next(currentScene?.soundFile)

        // this.soundUrl = of(currentScene?.soundFile)
        //
        // if(this.soundUrl !== currentScene?.soundFile) {
        //   this.soundUrl = currentScene.soundFile
        //   //this.playSound(currentScene.soundFile)
        // }
      })
  }

  ngOnDestroy(): void {
    super.unsubscribe()
  }

  // private delay = (time: number): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('setTimeout');
  //
  //       resolve('')
  //     }, time);
  //   })
  // }

  #audio: any
  #soundFile: string

  private playSound(soundFile: string) {

    if(!!!soundFile) {
      this.#audio?.pause()
      return
    }

    this.#audio?.pause()

    this.#audio = new Audio(soundFile);
    this.#audio.load()
    this.#audio.play()

    // if(!!!soundFile) {
    //   return
    // }
    //
    // var audio = new Audio(soundFile);
    // audio.load()
    // audio.play()
  }

  ngAfterViewInit() {
    this.soundUrl$.subscribe(url => {
      if(this.#soundFile !== url) {
        this.#soundFile = url
        this.playSound(url)
      }
    })
  }

  // private playSound() {
  //   const audio = new Audio('../assets/audio_file.mp3');
  //   audio.play();
  // }

  selectedScene(scene: IBaseSceneRunGame) {
    this.storeRunGameService.selectedScene(scene.id)
  }
}
