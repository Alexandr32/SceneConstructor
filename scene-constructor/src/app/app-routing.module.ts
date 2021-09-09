import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from './editor/editor.component';
import {GameListComponent} from './game-list/game-list.component';


const routes: Routes = [
  { path: '', component: GameListComponent, pathMatch: 'full' },
  { path: 'editor/:gameId', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
