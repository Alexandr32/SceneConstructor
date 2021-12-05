import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { IBaseSceneRunGameFirebase } from "./ibase-scene-run-game-firebase.model";
import { AnswerRunGameFirebase } from "./answer-run-game-firebase.model";


export interface SceneAnswerRunGameFirebase extends IBaseSceneRunGameFirebase {
  typesScene: TypeSceneEnum;
  id: string;
  title: string;
  text: string;
  soundFileId: string;
  imageFileId: string;
  videoFileId: string;
  answers: AnswerRunGameFirebase[];
  players: string[];
  isStartGame: boolean;
}
