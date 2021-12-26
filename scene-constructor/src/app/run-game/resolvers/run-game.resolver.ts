import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RunGame } from "../models/other-models/run-game.model";
import { RunGameService } from "../services/run-game.service";
import {StateRunGameService} from "../services/state-run-game.service";

@Injectable({ providedIn: 'root' })
export class RunGameResolver implements Resolve<RunGame> {

  constructor(private stateRunGameService: StateRunGameService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RunGame | Observable<RunGame> | Promise<RunGame> {

    const gameId = route.params['gameId']
    return this.stateRunGameService.getGameById(gameId)
  }



}
