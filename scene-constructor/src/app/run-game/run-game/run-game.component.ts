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
import {BehaviorSubject, Observable, of} from "rxjs";
import {SettingsRunGameService} from "../services/settings-run-game.service";

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent extends BaseComponent implements OnInit, OnDestroy {

  selectScene: IBaseSceneRunGame

  #audio: any
  #soundFile: string
  private soundUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  private soundOff$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private storeRunGameService: StoreRunGameService,
              private settingsRunGameService: SettingsRunGameService
  ) {
    super()
  }


  async ngOnInit() {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.selectScene = currentScene
        this.soundUrl$.next(currentScene?.soundFile)
      })

    this.settingsRunGameService.settingsRunGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(settings => {
      this.soundOff$.next(settings.isSoundOff)
    })
  }

  ngOnDestroy(): void {
    super.unsubscribe()
  }

  private playSound(soundFile: string) {

    if(!!!soundFile) {
      this.#audio?.pause()
      return
    }

    this.#audio?.pause()

    this.#audio = new Audio(soundFile);
    this.#audio.load()
    this.#audio.volume = this.settingsRunGameService.settingsRunGame.volumeSound
    this.#audio.play()
  }

  ngAfterViewInit() {

    this.soundOff$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(soundOff => {
      if(this.#audio) {
        if(soundOff) {
          this.#audio.pause()
        } else {
          this.#audio.play()
        }
      }
    })

    this.soundUrl$.subscribe(url => {
      if(this.#soundFile !== url) {
        this.#soundFile = url
        this.playSound(url)
      }
    })

    this.settingsRunGameService.settingsRunGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(settings => {
      if(!this.#audio) {
        return
      }

      if(this.#audio.volume !== settings.volumeSound) {
        this.#audio.volume = settings.volumeSound
      }

    })
  }

  selectedScene(scene: IBaseSceneRunGame) {
    //this.storeRunGameService.selectedScene(scene.id)

    // if(this.#audio) {
    //   this.volume = this.volume + 0.1
    //   this.#audio.volume = this.volume
    // }

  }
}
