import { Entity } from "../../../core/models/entity.model";
import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { AnswerRunGameFirebase } from "./answer-run-game-firebase.model";


export interface IBaseSceneRunGameFirebase extends Entity {
  id: string;
  title: string;
  text: string;
  soundFileId: string;
  typesScene: TypeSceneEnum;
  answers: AnswerRunGameFirebase[];
  players: string[];
  isStartGame: boolean;
}
