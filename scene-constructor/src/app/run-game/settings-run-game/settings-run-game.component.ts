import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {RunGame} from "../models/other-models/run-game.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {SettingsRunGameService} from "../services/settings-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-settings-run-game',
  templateUrl: './settings-run-game.component.html',
  styleUrls: ['./settings-run-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsRunGameComponent extends BaseComponent implements OnInit {

  isShow: boolean = false

  soundOff: boolean = false

  runGame: RunGame

  volumeSound: number = 0

  @Output()
  selectedScene: EventEmitter<IBaseSceneRunGame> = new EventEmitter<IBaseSceneRunGame>()

  constructor(private storeRunGameService: StoreRunGameService,
              private settingsRunGameService: SettingsRunGameService) {
    super()
  }

  ngOnInit(): void {
    this.storeRunGameService.runGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(runGame => {
      this.runGame = runGame
    })

    this.settingsRunGameService.settingsRunGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.volumeSound = value.volumeSound * 100
        this.soundOff = value.isSoundOff
    })
  }

  // Громче
  louder() {
    this.settingsRunGameService.louder()
  }

  // Тише
  quiet() {
    this.settingsRunGameService.quiet()
  }

  changeSound() {
    const isSoundOff = this.settingsRunGameService.settingsRunGame.isSoundOff
    if (isSoundOff) {
      this.settingsRunGameService.setSoundOn()
    } else {
      this.settingsRunGameService.setSoundOff()
    }
  }

}
