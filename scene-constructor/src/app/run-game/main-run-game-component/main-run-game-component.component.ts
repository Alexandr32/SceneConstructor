import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {RunGame} from "../models/other-models/run-game.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {RunGameService} from "../services/run-game.service";
import {Player} from "../models/other-models/player.model";

@Component({
  selector: 'app-main-run-game-component',
  templateUrl: './main-run-game-component.component.html',
  styleUrls: ['./main-run-game-component.component.scss']
})
export class MainRunGameComponentComponent implements OnInit {

  players: Player[]

  runGame$: Observable<RunGame>

  constructor(private route: ActivatedRoute, private runGameService: RunGameService) { }

  ngOnInit(): void {

    this.runGame$ = this.runGameService.runGame$

    this.runGame$.subscribe(runGame => {
      this.players = runGame.players
      console.log('MainRunGame:', runGame.players)
    })
  }

}
