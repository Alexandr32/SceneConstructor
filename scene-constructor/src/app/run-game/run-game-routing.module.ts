import {RouterModule, Routes} from '@angular/router';
import {RunGameComponent} from './run-game/run-game.component';
import {NgModule} from '@angular/core';
import {PlayerComponent} from './player/player.component';

const routes: Routes = [
  { path: '', component: RunGameComponent, pathMatch: 'full' },
  { path: ':gameId', component: RunGameComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunGameRoutingModule { }
