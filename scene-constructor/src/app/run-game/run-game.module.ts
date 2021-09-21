import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RunGameComponent} from './run-game.component';
import {RunGameRoutingModule} from './run-game-routing.module';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: RunGameRoutingModule.components,
  imports: [
    CommonModule,
    RunGameRoutingModule,
    RouterModule
  ]
})
export class RunGameModule { }
