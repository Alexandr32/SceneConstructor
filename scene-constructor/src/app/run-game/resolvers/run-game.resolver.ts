// import { Injectable } from "@angular/core";
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
// import { Observable } from "rxjs";
// import { RunGame } from "../models/other-models/run-game.model";
// import { RunGameService } from "../services/run-game.service";
// import {StateService} from "../services/state.service";
//
// //@Injectable({ providedIn: 'root' })
// @Injectable()
// export class RunGameResolver implements Resolve<RunGame> {
//
//   constructor() {
//
//   }
//
//    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RunGame | Observable<RunGame> | Promise<RunGame> {
//     const gameId = route.params['gameId']
//     // this.stateService.initStateGame(gameId)
//     // this.stateRunGameService.subscribeState()
//     return this.stateRunGameService.getGameById(gameId)
//   }
//
//
//
// }
