import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {RunGame} from "../models/other-models/run-game.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {SettingsRunGameService} from "../services/settings-run-game.service";

@Component({
  selector: 'app-settings-run-game',
  templateUrl: './settings-run-game.component.html',
  styleUrls: ['./settings-run-game.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SettingsRunGameComponent implements OnInit {

  isShow: boolean = true

  runGame: RunGame

  @Output()
  selectedScene: EventEmitter<IBaseSceneRunGame> = new EventEmitter<IBaseSceneRunGame>()

  constructor(private storeRunGameService: StoreRunGameService, private settingsRunGameService: SettingsRunGameService) { }

  ngOnInit(): void {
    this.storeRunGameService.runGame$.subscribe(runGame => {
      this.runGame = runGame
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

}
