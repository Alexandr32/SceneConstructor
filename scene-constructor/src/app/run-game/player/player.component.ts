import { Component, Input, OnInit } from '@angular/core';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { RunGameService } from 'src/app/run-game/services/run-game.service';
import { Player } from '../../core/models/player.model';
import { FileService } from 'src/app/core/services/file.service';
import { IBaseSceneRunGame } from '../models/other-models/base-scene-run-game.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  playerId: string

  @Input()
  gameId: string

  private scenes: IBaseSceneRunGame[]
  currentScene: IBaseSceneRunGame

  player: Player

  answers: AnswerRunGame[] = []

  constructor(
    private runGameService: RunGameService,
    private firestoreService: FirestoreService,
    private fileService: FileService) {

  }

  async ngOnInit() {
    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()
    this.scenes = game.scenes

    this.player = game.players.find(item => item.id === this.playerId)

    try {
      this.player.imageFile = await this.fileService
        .getUrl(game.id, this.player.imageFileId, TypeFile.PlayerImages).toPromise()
    } catch (error) {
      this.player.imageFile = 'assets/http_player.jpg'
    }

    this.runGameService.getStateGame(this.gameId)
      // .pipe(
      //   debounceTime(1000)
      // )
      .subscribe(stateGame => {
        this.currentScene = this.scenes.find(f => f.id === stateGame.currentScene)

        if (this.currentScene.players.includes(this.player.id)) {

          const answer = stateGame.answer.find(i => i.id == this.player.id)

          if (answer.value) {
            this.answers = []
          } else {
            this.answers = this.currentScene.answers
          }

        } else {
          this.answers = []
        }

      })
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.runGameService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}
