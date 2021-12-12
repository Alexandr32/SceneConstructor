import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Player} from "../../core/models/player.model";

@Component({
  selector: 'app-list-player-component',
  templateUrl: './list-player-component.component.html',
  styleUrls: ['./list-player-component.component.scss'],
})
export class ListPlayerComponentComponent implements OnInit {

  isShowListPlayers: boolean = false

  @Input()
  players: Player[] = []

  @Input()
  gameId: string

  constructor() { }

  ngOnInit(): void {
  }

}
