import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { IBaseSceneRunGameFirebase } from "./ibase-scene-run-game-firebase.model";
import { AnswerRunGameFirebase } from "./answer-run-game-firebase.model";


export interface PanoramaRunGameFirebase extends IBaseSceneRunGameFirebase {

  typesScene: TypeSceneEnum;
  id: string;
  title: string;
  text: string;
  soundFileId: string;
  isStartGame: boolean;
  players: string[];
  answers: AnswerRunGameFirebase[];
  imageFileId: string;
  isTimer: boolean;
  times: number; // В мс

}
