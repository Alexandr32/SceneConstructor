import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RunGameService } from 'src/app/serveces/run-game.service';
import { FirestoreService } from 'src/app/serveces/firestore.service';
import { Answer, Scene } from 'src/app/models/run/run-game.models';
import { Player } from 'src/app/models/player.model';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { first, timeout } from 'rxjs/operators';
import { TypeFile } from 'src/app/models/type-file.model';

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent implements OnInit, OnDestroy {

  title: string

  private scenes: Map<string, Scene> = new Map<string, Scene>()

  url = 'assets/scene.jpg'

  isShowListPlayers: boolean = false

  selectScene: Scene

  videoSources: string[] = [];
  players: string[] = []

  gameId: string

  answers$: BehaviorSubject<{ id: string, value: string }[]> = new BehaviorSubject([])

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private runGameService: RunGameService,
    private firestoreService: FirestoreService,) {

  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  static count = 0

  async ngOnInit() {
    this.gameId = this.route.snapshot.params.gameId;

    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()

    for (const scene of game.scenes) {

      if (scene.imageFileId) {
        try {
          scene.imageFile = await this.firestoreService
            .getUrl(game.id, scene.imageFileId, TypeFile.SceneImages).toPromise()
        } catch (error) {
          scene.imageFile = '/assets/http_scene.jpg';
          console.error('Изображение не найдено');
          console.error(error);
        }
      } else {
        scene.imageFile = '/assets/http_scene.jpg';
      }

      if (scene.videoFileId) {
        try {

          scene.videoFile = await this.firestoreService
            .getUrl(game.id, scene.videoFileId, TypeFile.SceneVideos).toPromise()

        } catch (error) {
          scene.videoFile = '';
          console.error(error);
        }
      } else {
        scene.videoFile = '';
      }

      this.scenes.set(scene.id, scene)
    }

    this.players = game.players.map(item => {
      return item.id
    })

    this.videoSources = []

    const stateGame = await this.runGameService.getStateGame(this.gameId)
      .pipe(first())
      .toPromise()

    this.selectScene = this.scenes.get(stateGame.currentScene)
    this.videoSources = []
    this.videoSources.push(this.selectScene.videoFile)

    this.subscribeStateGame()
  }

  private subscribeStateGame() {
    this.runGameService.getStateGame(this.gameId)
      .subscribe(async (stateGame) => {

        console.log('stateGame::::', stateGame);

        this.answers$.next(stateGame.answer)

        const isEmpty = stateGame.answer.map(item => item.value).includes('')

        if (isEmpty) {
          return
        }

        // Ищем выбранные ответы
        const dictionary = new Map<string, number>();
        stateGame.answer
          .map(item => {
            return item.value
          })
          .forEach((item) => {
            let count: number = dictionary.get(item)
            if (count) {
              count++
              dictionary.set(item, count)
            } else {
              dictionary.set(item, 0)
            }
          });

        if (dictionary.size === 0) {
          return
        }

        const selectAnswerId = [...dictionary.entries()].reduce((a, e) => e[1] > a[1] ? e : a)

        const selectAnswer = this.selectScene.answers.find((item) => item.id === selectAnswerId[0])

        if (!selectAnswer) {
          return
        }

        // Есть выбранная сцена
        if (selectAnswer.sceneId) {
          await this.delay(500)
          this.selectScene = this.scenes.get(selectAnswer.sceneId)
        }

        this.videoSources = []
        this.videoSources.push(this.selectScene.videoFile)

        // Обнуляем данные
        this.runGameService.resetDataStateGame(this.gameId, this.selectScene)

      })
  }

  private delay = (time: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('setTimeout');

        resolve('')
      }, time);
    })
  }

}
