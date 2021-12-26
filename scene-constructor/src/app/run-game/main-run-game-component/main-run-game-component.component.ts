import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {RunGame} from "../models/other-models/run-game.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {RunGameService} from "../services/run-game.service";
import {Player} from "../models/other-models/player.model";
import {StateRunGameService} from "../services/state-run-game.service";

@Component({
  selector: 'app-main-run-game-component',
  templateUrl: './main-run-game-component.component.html',
  styleUrls: ['./main-run-game-component.component.scss']
})
export class MainRunGameComponentComponent implements OnInit {

  players$: Observable<Player[]>

  runGame$: Observable<RunGame>

  constructor(private route: ActivatedRoute,
              private stateRunGameService: StateRunGameService,
              private runGameService: RunGameService) { }

  ngOnInit(): void {

    this.players$ = this.stateRunGameService.players$
    this.runGame$ = this.stateRunGameService.runGame$

    // this.runGame$ = this.runGameService.runGame$
    //
    // this.runGame$.subscribe(runGame => {
    //   this.players = runGame.players
    //   console.log('runGame:', runGame)
    //   console.log('MainRunGame:', runGame.players)
    // })
  }

}
