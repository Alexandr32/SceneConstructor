import { RouterModule, Routes } from '@angular/router';
import { RunGameComponent } from './run-game/run-game.component';
import { NgModule } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { RunGameResolver } from './resolvers/run-game.resolver';

const routes: Routes = [
  { path: '', component: RunGameComponent, pathMatch: 'full' },
  {
    path: ':gameId',
    component: RunGameComponent, pathMatch: 'full',
    resolve: {
      runGame: RunGameResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunGameRoutingModule { }
