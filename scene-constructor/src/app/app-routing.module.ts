import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from './editor/editor/editor.component';
import {GameListComponent} from './editor/game-list/game-list.component';
import {MainComponent} from './editor/main/main.component';
import {AuthComponent} from "./editor/auth-component/auth.component";
import {AuthGuard} from "./guard/auth.guard";
import {GamePlayerRoutingModule} from "./player-game/game-player/game-player.module";

// определение дочерних маршрутов
const editRoutes: Routes = [
  {
    path: '',
    component: GameListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'login', component: AuthComponent
  },
  {
    path: 'editor/:gameId', component: EditorComponent,
    canActivate: [AuthGuard],
  },
];

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: editRoutes,
  },
  {
    path: 'run',
    loadChildren: () => import('./run-game/run-game-routing.module').then(m => m.RunGameRoutingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'game-player',
    loadChildren: () => import('./player-game/game-player/game-player.module').then(m => m.GamePlayerRoutingModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
