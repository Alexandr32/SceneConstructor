import { Component, Input, OnInit } from '@angular/core';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { RunGameService } from 'src/app/run-game/services/run-game.service';
import { Player } from '../../../core/models/player.model';
import { FileService } from 'src/app/core/services/file.service';
import { IBaseSceneRunGame } from '../../models/other-models/base-scene-run-game.model';
import {StateService} from "../../services/state.service";

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

  private scenesMap: Map<string, IBaseSceneRunGame>
  currentScene: IBaseSceneRunGame

  player: Player

  answers: AnswerRunGame[] = []

  constructor(
    private runGameService: RunGameService,
    private stateService: StateService,
    private firestoreService: FirestoreService,
    private fileService: FileService) {

    //console.log('constructor')
  }

  async ngOnInit() {

    // const runGame = await this.runGameService.runGame$.toPromise()
    // this.scenesMap = runGame.scenesMap
    // if(!this.player) {
    //   this.player = runGame.players.find(item => item.id === this.playerId)
    // }

    this.runGameService.runGame$.subscribe(runGame => {
      this.scenesMap = runGame.scenesMap
      if(!this.player) {
        this.player = runGame.players.find(item => item.id === this.playerId)
      }
    })

    this.stateService.getStateGame(this.gameId).subscribe(state => {
      this.scenesMap.get(state.currentSceneId)
    })

    //const game = await this.runGameService.runGame$
    //this.scenes = game.scenes

    /*if(!this.player) {
      this.player = game.players.find(item => item.id === this.playerId)

      // try {
      //   this.player.imageFile = await this.fileService
      //     .getUrl(game.id, this.player.imageFileId, TypeFile.PlayerImages).toPromise()
      // } catch (error) {
      //   this.player.imageFile = 'assets/http_player.jpg'
      // }
    }*/

    //console.log(this.player)

    // this.runGameService.getStateGame(this.gameId)
    //   // .pipe(
    //   //   debounceTime(1000)
    //   // )
    //   .subscribe(stateGame => {
    //     this.currentScene = this.scenes.find(f => f.id === stateGame.currentScene)
    //
    //     if (this.currentScene.players.includes(this.player.id)) {
    //
    //       const answer = stateGame.answer.find(i => i.id == this.player.id)
    //
    //       if (answer.value) {
    //         this.answers = []
    //       } else {
    //         this.answers = this.currentScene.answers
    //       }
    //
    //     } else {
    //       this.answers = []
    //     }
    //
    //   })
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.stateService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}