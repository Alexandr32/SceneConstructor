import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunGameComponent } from './run-game/run-game.component';
import { RunGameRoutingModule } from './run-game-routing.module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlayerComponent } from './list-player-component/player/player.component';
import { ItemAnswerComponent } from './item-answer/item-answer.component';
import { MainRunGameComponentComponent } from './main-run-game-component/main-run-game-component.component';
import { ListPlayerComponentComponent } from './list-player-component/list-player-component.component';
import { SettingsRunGameComponent } from './settings-run-game/settings-run-game.component';
import { AnswerSceneComponentComponent } from './answer-scene-component/answer-scene-component.component';
import { PanoramaSceneComponentComponent } from './panorama-scene-component/panorama-scene-component.component';
import { PuzzleSceneComponentComponent } from './puzzle-scene-component/puzzle-scene-component.component';
import { VideoComponent } from './answer-scene-component/video/video.component';
import {RefDirective} from "../core/directive/ref.directive";
import { ScenesListComponent } from './settings-run-game/scenes-list/scenes-list.component';
import { BackgroundSceneComponent } from './background-scene/background-scene.component';
import { ListAnswersComponent } from './list-answers/list-answers.component';

@NgModule({
  declarations: [
    RunGameComponent,
    PlayerComponent,
    ItemAnswerComponent,
    MainRunGameComponentComponent,
    ListPlayerComponentComponent,
    SettingsRunGameComponent,
    AnswerSceneComponentComponent,
    PanoramaSceneComponentComponent,
    PuzzleSceneComponentComponent,
    VideoComponent,
    RefDirective,
    ScenesListComponent,
    BackgroundSceneComponent,
    ListAnswersComponent,
  ],
  imports: [
    CommonModule,
    RunGameRoutingModule,
    RouterModule,
    DragDropModule,
  ]
})
export class RunGameModule { }
