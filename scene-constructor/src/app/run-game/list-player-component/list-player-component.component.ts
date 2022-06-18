import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Player} from "../../core/models/player.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../base-component/base-component.component";
import {Route, Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-list-player-component',
  templateUrl: './list-player-component.component.html',
  styleUrls: ['./list-player-component.component.scss'],
  animations: [
    trigger('listPlayer', [
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
export class ListPlayerComponentComponent extends BaseComponent implements OnInit, OnDestroy {

  isShowListPlayers: boolean = false

  players: Player[] = []

  @Input()
  isDevelopMode = false

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
