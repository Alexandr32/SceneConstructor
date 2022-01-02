import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {IBaseSceneRunGame} from '../models/other-models/base-scene-run-game.model';
import {StoreRunGameService} from "../services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent extends BaseComponent implements OnInit, OnDestroy {

  selectScene: IBaseSceneRunGame

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private storeRunGameService: StoreRunGameService
  ) {
    super()
  }


  async ngOnInit() {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.selectScene = currentScene
      })

  }

  ngOnDestroy(): void {
    super.unsubscribe()
  }

  private delay = (time: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('setTimeout');

        resolve('')
      }, time);
    })
  }

  private playSound() {
    var audio = new Audio('../assets/audio_file.mp3');
    audio.play();
  }

  selectedScene(scene: IBaseSceneRunGame) {
    this.storeRunGameService.selectedScene(scene.id)
  }
}
