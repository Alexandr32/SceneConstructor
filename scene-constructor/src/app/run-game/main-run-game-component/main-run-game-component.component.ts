import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StoreRunGameService} from "../services/store-run-game.service";

@Component({
  selector: 'app-main-run-game-component',
  templateUrl: './main-run-game-component.component.html',
  styleUrls: ['./main-run-game-component.component.scss']
})
export class MainRunGameComponentComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private storeRunGameService: StoreRunGameService) { }

  async ngOnInit() {
    const gameId = this.route.snapshot.params.gameId
    await this.storeRunGameService.initGame(gameId)
  }

}
