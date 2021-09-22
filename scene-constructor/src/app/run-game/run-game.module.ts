import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RunGameComponent} from './run-game/run-game.component';
import {RunGameRoutingModule} from './run-game-routing.module';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PlayerComponent} from './player/player.component';

@NgModule({
  declarations: [
    RunGameComponent,
    PlayerComponent
  ],
  imports: [
    CommonModule,
    RunGameRoutingModule,
    RouterModule,
    DragDropModule,
  ]
})
export class RunGameModule { }
