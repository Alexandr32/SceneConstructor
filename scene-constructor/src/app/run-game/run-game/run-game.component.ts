import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {IBaseSceneRunGame} from '../models/other-models/base-scene-run-game.model';
import {StoreRunGameService} from "../services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {filter, takeUntil} from "rxjs/operators";
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
  private isSound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              public storeRunGameService: StoreRunGameService,
              private settingsRunGameService: SettingsRunGameService
  ) {
    super()
  }


  async ngOnInit() {

    this.storeRunGameService.stateGame$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(i => i !== null)
      )
      .subscribe((state) => {
        console.log(state)
        this.selectScene = state.currentScene
        this.soundUrl$.next(state?.currentScene?.soundFile)
      })

    this.settingsRunGameService.settingsRunGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(settings => {
        this.isSound$.next(settings.isSound)
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  private playSound(soundFile: string) {

    if (!!!soundFile) {
      this.#audio?.pause()
      return
    }

    this.#audio?.pause()

    this.#audio = new Audio(soundFile);
    this.#audio.load()
    this.#audio.volume = this.settingsRunGameService.settingsRunGame.volumeSound

    if(this.settingsRunGameService.settingsRunGame.isSound) {
      this.#audio.play()
    }

  }

  ngAfterViewInit() {

    this.isSound$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isSound => {

        if (this.#audio) {
          if (isSound) {
            this.#audio.play()
          } else {
            this.#audio.pause()
          }
        }
      })

    this.soundUrl$.subscribe(url => {
      if (this.#soundFile !== url) {
        this.#soundFile = url
        this.playSound(url)
      }
    })

    this.settingsRunGameService.settingsRunGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(settings => {
        if (!this.#audio) {
          return
        }

        if (this.#audio.volume !== settings.volumeSound) {
          this.#audio.volume = settings.volumeSound
        }

      })
  }
}
