import {Injectable} from '@angular/core';
import {SettingsRunGame} from "../models/other-models/settings-run-game.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsRunGameService {

  #settingsRunGame$: BehaviorSubject<SettingsRunGame> = new BehaviorSubject<SettingsRunGame>(null)

  public get settingsRunGame$(): Observable<SettingsRunGame> {
    return this.#settingsRunGame$
  }

  public get settingsRunGame(): SettingsRunGame {
    return this.#settingsRunGame$.value
  }

  constructor() {
    this.#settingsRunGame$.next({
      volumeSound: 0.5,
      isSoundOff: false
    } as SettingsRunGame)
  }

  // Громче
  louder() {
    const value = this.#settingsRunGame$.value

    if(value.volumeSound >= 1) {
      return
    }

    value.volumeSound = Number((value.volumeSound + 0.1).toFixed(1))

    this.#settingsRunGame$.next({...value})
  }

  // Тише
  quiet() {
    const value = this.#settingsRunGame$.value
    if(value.volumeSound <= 0) {
      return
    }

    value.volumeSound = Number((value.volumeSound - 0.1).toFixed(1))

    this.#settingsRunGame$.next({...value})
  }

  setSoundOff() {
    const value = this.#settingsRunGame$.value
    value.isSoundOff = true
    this.#settingsRunGame$.next({...value})
  }

  setSoundOn() {
    const value = this.#settingsRunGame$.value
    value.isSoundOff = false
    this.#settingsRunGame$.next({...value})
  }
}