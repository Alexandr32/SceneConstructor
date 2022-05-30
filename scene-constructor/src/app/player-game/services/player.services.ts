import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Player} from "../../run-game/models/other-models/player.model";

// TODO: Сервис не используется
@Injectable({
  providedIn: 'root'
})
export class PlayerServices {

  #player$: BehaviorSubject<Player> = new BehaviorSubject<Player>(null)
  get player$(): Observable<Player> {
    return this.player$
  }

  init(player: Player) {
    this.#player$.next(player)
  }
}
