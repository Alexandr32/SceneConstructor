import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {GamePlayerComponent} from "./game-player.component";
import {PlayerModule} from "../player.module";


const routes: Routes = [
  {
    path: ':gameId/:playerId',
    component: GamePlayerComponent, pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamePlayerRoutingModule { }

@NgModule({
  declarations: [
    GamePlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PlayerModule
  ]
})
export class GamePlayerModule { }
