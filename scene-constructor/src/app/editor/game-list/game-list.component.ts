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

    console.log('pannellum', pannellum);


    this.viewer = pannellum.viewer('panoramaContainer', {
      "type": "equirectangular",
      "panorama": "../assets/2.jpg",
      "autoLoad": true,
      "autoRotate": true,
      'showFullscreenCtrl': false,
      'autoRotateInactivityDelay': 1,
      'minYaw': -160,
      'maxYaw': 160,
      'hfov': 160,
      'minPitch': -80,
      'maxPitch': 80,
      'showZoomCtrl': false,
      'keyboardZoom': false,
      'mouseZoom': false,
      'showControls': false

    });

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

  top() {
    this.viewer.setPitch(this.viewer.getPitch() + 20);
  }

  topLeft() {
    this.top()
    this.left()
  }

  topRight() {
    this.top()
    this.right()
  }

  center() {
    this.viewer.setPitch(0);
    this.viewer.setYaw(0);
  }

  bottom() {
    this.viewer.setPitch(this.viewer.getPitch() - 20);
  }

  bottomLeft() {
    this.bottom()
    this.left()
  }

  bottomRight() {
    this.bottom()
    this.right()
  }

  left() {
    this.viewer.setYaw(this.viewer.getYaw() - 50);
  }

  right() {
    this.viewer.setYaw(this.viewer.getYaw() + 50);
  }
}
