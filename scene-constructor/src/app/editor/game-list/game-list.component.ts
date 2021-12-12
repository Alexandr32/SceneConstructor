import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../models/game.model';
import { FirestoreService } from '../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessageDialogComponent } from '../../core/message-dialog/message-dialog.component';
import { Subscriber, Subscription } from 'rxjs';
import { Router } from '@angular/router';
//import * as pannellum from 'node_modules/pannellum'
declare let pannellum: any;

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {

  gameList: Game[] = []

  game$: Subscription

  viewer: any

  constructor(private dialog: MatDialog,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
    private router: Router) { }

  ngOnInit(): void {

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: 'Загрузка'
    });

    this.game$ = this.firestoreService.getGames().subscribe((items) => {

      dialogSave.close()

      this.gameList = items

    }, error => {

      this.dialog.open(MessageDialogComponent, {
        data: 'Произошла ошибка: ' + error
      });

    })
  }

  async deleteGame(game: Game) {
    await this.firestoreService.deleteGame(game)
  }

  async createNewGame() {

    const numberArray: number[] = this.gameList.map(item => item.number)

    let maxNumber: number = 0
    if (numberArray.length != 0) {
      maxNumber = Math.max(...numberArray)
    }

    maxNumber += 1

    const game = new Game(
      this.fireStore.createId(),
      maxNumber,
      'Новая игра',
      'Описание игры',
      [],
      [])

    await this.firestoreService.saveGame(game)
  }

  identify(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.game$.unsubscribe()
  }
}
