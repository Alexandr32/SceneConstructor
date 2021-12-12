import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RunGameResolver } from './resolvers/run-game.resolver';
import {MainRunGameComponentComponent} from "./main-run-game-component/main-run-game-component.component";

const routes: Routes = [
  { path: '', component: MainRunGameComponentComponent, pathMatch: 'full' },
  {
    path: ':gameId',
    component: MainRunGameComponentComponent, pathMatch: 'full',
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
