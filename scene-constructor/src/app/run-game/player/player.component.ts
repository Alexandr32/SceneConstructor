import { Component, Input, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Answer, Scene } from 'src/app/models/run/run-game.models';
import { TypeFile } from 'src/app/models/type-file.model';
import { FirestoreService } from 'src/app/serveces/firestore.service';
import { RunGameService } from 'src/app/serveces/run-game.service';
import { Player } from '../../models/player.model';

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

  private scenes: Scene[]
  currentScene: Scene

  player: Player

  answers: Answer[] = []

  constructor(
    private runGameService: RunGameService,
    private firestoreService: FirestoreService) {

  }

  async ngOnInit() {
    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()
    this.scenes = game.scenes

    this.player = game.players.find(item => item.id === this.playerId)

    try {
      this.player.imageFile = await this.firestoreService
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

  async selectAnswer(answer: Answer) {
    await this.runGameService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}
