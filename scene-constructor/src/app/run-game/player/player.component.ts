import { Component, Input, OnInit } from '@angular/core';
import { Answer, Scene } from 'src/app/models/run/run-game.models';
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
    private firestoreService: FirestoreService) { }

  async ngOnInit() {
    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()
    this.scenes = game.scenes

    this.player = game.players.find(item => item.id === this.playerId)

    try {
      this.player.imageFile = await this.firestoreService
        .getUrl(game.id, this.player.imageFileId, 'PlayerImage').toPromise()
    } catch (error) {
      this.player.imageFile = 'assets/http_player.jpg'
    }

    this.runGameService.getStateGame(this.gameId).subscribe(item => {
      this.currentScene = this.scenes.find(f => f.id === item.currentScene)

      if (this.currentScene.players.includes(this.player.id)) {
        this.answers = this.currentScene.answers
      } else {
        this.answers = []
      }


      console.log('answer', this.answers);
      console.log('item.currentScene:player', item);


    })
  }

  selectAnswer(answer: Answer) {
    this.runGameService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }

}
