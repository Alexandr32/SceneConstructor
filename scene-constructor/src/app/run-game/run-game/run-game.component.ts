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
  private players: Map<string, Player> = new Map<string, Player>()

  url = 'assets/scene.jpg'

  isShowListPlayers: boolean = false

  selectScene: Scene

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private runGameService: RunGameService,
    private firestoreService: FirestoreService,) { }

  async ngOnInit() {
    const gameId = this.route.snapshot.params.gameId;
    this.title = gameId

    const game = await (await this.runGameService.getGameById(gameId)).toPromise()

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

    for (const player of game.players) {
      this.players.set(player.id, player)
    }

    this.selectScene = this.scenes.get('LXBvckaeQSHyrDo5UQLH')

    console.log(this.scenes);
    console.log(this.selectScene);
  }



}
