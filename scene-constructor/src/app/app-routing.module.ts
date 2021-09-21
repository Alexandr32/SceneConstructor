import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from './editor/editor.component';
import {GameListComponent} from './game-list/game-list.component';
import {RunGameComponent} from './run-game/run-game.component';


const routes: Routes = [
  { path: '', component: GameListComponent, pathMatch: 'full' },
  { path: 'editor/:gameId', component: EditorComponent },
  { path: 'run/:gameId', component: RunGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
