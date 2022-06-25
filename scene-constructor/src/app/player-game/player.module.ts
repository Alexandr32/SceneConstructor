import {NgModule} from "@angular/core";
import {GamePlayerComponent} from "./game-player/game-player.component";
import {PlayerComponent} from "./player/player.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PanoramaControlsComponent} from "./panoram-controls/panorama-controls.component";
import {PuzzleControlsComponent} from "./puzzle-controls/puzzle-controls.component";
import {PlayerListAnswersComponent} from "./list-answers/player-list-answers.component";
import {MatButtonModule} from "@angular/material/button";
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    PlayerComponent,
    PanoramaControlsComponent,
    PuzzleControlsComponent,
    PlayerListAnswersComponent
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        DragDropModule
    ],
  exports: [
    PlayerComponent,
    PanoramaControlsComponent,
    PuzzleControlsComponent,
    PlayerListAnswersComponent
  ]
})
export class PlayerModule {

}
