import { Player } from "src/app/core/models/player.model";
import { IBaseSceneRunGame } from "./base-scene-run-game.model";

export class RunGame {
  constructor(
    public id: string,
    public number: number,
    public name: string,
    public description: string,
    public scenes: IBaseSceneRunGame[],
    public players: Player[],
  ) {
  }
}
