import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RunGame } from "../models/other-models/run-game.model";
import { RunGameService } from "../services/run-game.service";

@Injectable({ providedIn: 'root' })
export class RunGameResolver implements Resolve<any> {

  constructor(private runGameService: RunGameService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RunGame | Observable<RunGame> | Promise<RunGame> {

    const gameId = route.params['gameId']
    return this.runGameService.getGameById(gameId)
  }



}
