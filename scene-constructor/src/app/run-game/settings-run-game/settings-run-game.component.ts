import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RunGame} from "../models/other-models/run-game.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {SettingsRunGameService} from "../services/settings-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-settings-run-game',
  templateUrl: './settings-run-game.component.html',
  styleUrls: ['./settings-run-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('settingMenu', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('0.1s', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)'}),
        animate('0.1s', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class SettingsRunGameComponent extends BaseComponent implements OnInit {

  isShow: boolean = false

  isSound: boolean = false

  runGame: RunGame

  volumeSound: number = 0

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
        this.isSound = value.isSound
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
    const isSound = this.settingsRunGameService.settingsRunGame.isSound
    if (!isSound) {
      this.settingsRunGameService.setSoundOn()
    } else {
      this.settingsRunGameService.setSoundOff()
    }
  }

}
