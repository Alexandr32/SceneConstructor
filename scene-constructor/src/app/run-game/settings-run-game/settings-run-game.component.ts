import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {RunGame} from "../models/other-models/run-game.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";

@Component({
  selector: 'app-settings-run-game',
  templateUrl: './settings-run-game.component.html',
  styleUrls: ['./settings-run-game.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SettingsRunGameComponent implements OnInit {

  isShow: boolean = true

  @Input()
  runGame$: Observable<RunGame>

  @Output()
  selectedScene: EventEmitter<IBaseSceneRunGame> = new EventEmitter<IBaseSceneRunGame>()

  constructor() { }

  ngOnInit(): void {
  }

}
