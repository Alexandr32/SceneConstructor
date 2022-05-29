import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {Observable} from "rxjs";
import {Player} from "../../core/models/player.model";
import {PlayerServices} from "../services/player.services";
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {RunGameService} from "../../run-game/services/run-game.service";
import {StateService} from "../../run-game/services/state.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'game-player',
  templateUrl: './game-player.component.html',
  styleUrls: ['./game-player.component.scss'],
  providers: [
    StateService,
    RunGameService,
    StoreRunGameService,
    PlayerServices
  ]
})
export class GamePlayerComponent implements OnInit {

  constructor(
    public playerServices: PlayerServices,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    const gameId = this.route.snapshot.params.gameId;
    const playerId = this.route.snapshot.params.playerId;

    console.log('gameId:', gameId)
    console.log('playerId:', playerId)
  }
}
