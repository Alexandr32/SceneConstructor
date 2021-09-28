import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RunGameService } from 'src/app/serveces/run-game.service';
import { FirestoreService } from 'src/app/serveces/firestore.service';
import { Scene } from 'src/app/models/run/run-game.models';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent implements OnInit {

  title: string

  private scenes: Map<string, Scene> = new Map<string, Scene>()

  url = 'assets/scene.jpg'

  isShowListPlayers: boolean = false

  selectScene: Scene

  videoSources: string[] = [];
  players: string[] = []

  gameId: string

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private runGameService: RunGameService,
    private firestoreService: FirestoreService,) { }

  async ngOnInit() {
    this.gameId = this.route.snapshot.params.gameId;

    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()

    for (const scene of game.scenes) {

      if (scene.imageFileId) {
        try {
          scene.imageFile = await this.firestoreService
            .getUrl(game.id, scene.imageFileId, 'SceneImage').toPromise()
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
            .getUrl(game.id, scene.videoFileId, 'SceneVideo').toPromise()

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

    this.runGameService.getStateGame(this.gameId).subscribe(stateGame => {
      console.log('stateGame::::', stateGame);
      this.selectScene = this.scenes.get(stateGame.currentScene)
      this.videoSources = []
      this.videoSources.push(this.selectScene.videoFile)
    })
  }

  next() {
    this.selectScene = this.scenes.get('00QPeK4tegh5sJYHcd3s')

    console.log(this.scenes);
    console.log(this.selectScene.videoFile);

    this.videoSources = []
    this.videoSources.push(this.selectScene.videoFile)
  }


}