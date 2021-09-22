import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from './editor/editor.component';
import {GameListComponent} from './game-list/game-list.component';
import {MainComponent} from './main/main.component';

// определение дочерних маршрутов
const editRoutes: Routes = [
  { path: '', component: GameListComponent, pathMatch: 'full' },
  { path: 'editor/:gameId', component: EditorComponent },
];

const routes: Routes = [
  { path: '', component: MainComponent, children: editRoutes },
  { path: 'run', loadChildren: () => import('./run-game/run-game-routing.module').then(m => m.RunGameRoutingModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
