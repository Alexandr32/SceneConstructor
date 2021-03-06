import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/editor/models/game.model';

@Component({
  selector: 'app-item-game',
  templateUrl: './item-game.component.html',
  styleUrls: ['./item-game.component.scss']
})
export class ItemGameComponent implements OnInit {

  @Input()
  game: Game

  @Output()
  delete: EventEmitter<Game> = new EventEmitter<Game>()

  backgroundCssClass = 'item-game__background-select'

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.backgroundCssClass = 'item-game__background'
    }, 1000)
  }

  deleteGame() {
    this.delete.next(this.game)
  }

}
