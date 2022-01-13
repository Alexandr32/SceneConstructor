import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../models/game.model';
import { FirestoreService } from '../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../core/message-dialog/message-dialog.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
declare let pannellum: any;

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent extends BaseComponent implements OnInit, OnDestroy {

  gameList: Game[] = []

  game$: Subscription

  viewer: any

  constructor(private dialog: MatDialog,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
    private router: Router) {
    super()
  }

  ngOnInit(): void {

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: 'Загрузка'
    });

    this.game$ = this.firestoreService.getGames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {

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
    this.unsubscribe()
  }
}
