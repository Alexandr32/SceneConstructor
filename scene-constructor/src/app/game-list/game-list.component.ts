import { Component, OnInit } from '@angular/core';
import {Game} from '../models/game.model';
import {FirestoreService} from '../serveces/firestore.service';
import {MatDialog} from '@angular/material/dialog';
import {AngularFirestore} from '@angular/fire/firestore';
import {MessageDialogComponent} from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  gameList: Game[] = []

  constructor(private dialog: MatDialog,
              private fireStore: AngularFirestore,
              private firestoreService: FirestoreService) { }

  ngOnInit(): void {

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: 'Загрузка'
    });

    this.firestoreService.getGames().subscribe((items) => {

      dialogSave.close()

      this.gameList = items
      console.log('items:', items);

    }, error => {

      this.dialog.open(MessageDialogComponent, {
        data: 'Произошла ошибка: ' + error
      });

    })
  }

  async deleteGame(gameId: string) {
    await this.firestoreService.deleteGame(gameId)
  }

  async getById(gameId: string) {
   this.firestoreService.getGameById(gameId).subscribe((item) => {
     console.log('item::::::', item);
   })

  }

  async createNewGame() {
    const game = new Game(
      this.fireStore.createId(),
      'Новая игра',
      'Описание игры',
      [],
      [])

    await this.firestoreService.saveGame(game)
  }
}
