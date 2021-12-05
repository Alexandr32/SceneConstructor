import { Player } from "src/app/core/models/player.model";
import { IBaseSceneRunGame } from "./base-scene-run-game.model";

export class RunGame {

  scenesMap: Map<string, IBaseSceneRunGame>

  constructor(
    public id: string,
    public number: number,
    public name: string,
    public description: string,
    public scenes: IBaseSceneRunGame[],
    public players: Player[],
  ) {
  }

  createsScenesMap() {
    this.scenesMap = new Map(this.scenes.map(key => [key.id, key]));
  }
}
