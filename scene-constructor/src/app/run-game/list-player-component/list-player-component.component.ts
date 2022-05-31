import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Player} from "../../core/models/player.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../base-component/base-component.component";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-list-player-component',
  templateUrl: './list-player-component.component.html',
  styleUrls: ['./list-player-component.component.scss'],
})
export class ListPlayerComponentComponent extends BaseComponent implements OnInit, OnDestroy {

  isShowListPlayers: boolean = false

  players: Player[] = []

  constructor(
    private storeRunGameService: StoreRunGameService,
    private router: Router
  ) { super() }

  ngOnInit(): void {
    this.storeRunGameService.players$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(players => {
      this.players = players
    })
  }

  goToPlayer(player: Player) {

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/game-player', this.storeRunGameService.stateGameId, player.id])
    );

    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
