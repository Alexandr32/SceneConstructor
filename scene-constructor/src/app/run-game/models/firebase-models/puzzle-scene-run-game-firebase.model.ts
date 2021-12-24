import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { IBaseSceneRunGameFirebase } from "./ibase-scene-run-game-firebase.model";
import { AnswerRunGameFirebase } from "./answer-run-game-firebase.model";


export interface PuzzleSceneRunGameFirebase extends IBaseSceneRunGameFirebase {

  typesScene: TypeSceneEnum;
  id: string;
  title: string;
  text: string;
  soundFileId: string;
  imagePuzzleFileId: string;
  // Изображение фона
  imageFileId: string
  // Видео фона
  videoFileId: string
  answers: AnswerRunGameFirebase[];
  players: string[];
  isStartGame: boolean;
  scenePartsPuzzleImages: { number: number; imgId: number; }[];
  playerScenePartsPuzzleImages: {
    playerId: string;
    scenePartsPuzzleImages: {
      number: number;
      imgId: number;
    }[];
  }[];
}
