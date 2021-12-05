import { IBaseSceneRunGame } from "./base-scene-run-game.model";

export class AnswerRunGame {
  constructor(
    public id: string,
    public text: string,
    public position: number,
    public parentScene: IBaseSceneRunGame,
    public sceneId: string) { }
}
