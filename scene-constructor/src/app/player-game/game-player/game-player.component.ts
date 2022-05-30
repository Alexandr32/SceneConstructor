import {Component, OnInit} from "@angular/core";
import {Player} from "../../core/models/player.model";
import {PlayerServices} from "../services/player.services";
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {RunGameService} from "../../run-game/services/run-game.service";
import {StateService} from "../../run-game/services/state.service";
import {ActivatedRoute} from "@angular/router";
import {first} from "rxjs/operators";
import {BaseComponent} from "../../base-component/base-component.component";

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
export class GamePlayerComponent extends BaseComponent implements OnInit {

  player: Player | undefined

  constructor(
    private storeRunGameService: StoreRunGameService,
    private route: ActivatedRoute,
  ) {
    super()
  }

  async ngOnInit() {

    const gameId = this.route.snapshot.params.gameId;
    const playerId = this.route.snapshot.params.playerId;

    await this.storeRunGameService.initGame(gameId)

    const players = await this.storeRunGameService.players$
      .pipe(first())
      .toPromise()

    this.player = players.find(item => item.id === playerId)
  }
}
