import {Component, OnDestroy, OnInit} from '@angular/core';
import {Player} from "../../core/models/player.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../base-component/base-component.component";

@Component({
  selector: 'app-list-player-component',
  templateUrl: './list-player-component.component.html',
  styleUrls: ['./list-player-component.component.scss'],
})
export class ListPlayerComponentComponent extends BaseComponent implements OnInit, OnDestroy {

  isShowListPlayers: boolean = false

  players: Player[] = []

  constructor(private storeRunGameService: StoreRunGameService) { super() }

  ngOnInit(): void {
    this.storeRunGameService.players$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(players => {
      this.players = players
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
