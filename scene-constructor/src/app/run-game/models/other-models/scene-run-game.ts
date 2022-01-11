import {IBaseSceneRunGame} from "./base-scene-run-game.model";
import {IBaseBackgroundScene} from "../../../core/models/base-background-scene.model";
import {FileLink} from "../../../core/models/file-link.model.ts";
import {TypeSceneEnum} from "../../../core/models/type-scene.enum";
import {AnswerRunGame} from "./answer.model";

export class SceneRunGame implements IBaseSceneRunGame, IBaseBackgroundScene {
    id: string
    title: string
    text: string
    color: string

    soundFileId: string
    soundFile: string
    soundFileLink: FileLink

    typesScene: TypeSceneEnum = TypeSceneEnum.Answer

    isStartGame: boolean = false

    players: string[] = []

    answers: AnswerRunGame[] = []

    // Изображение фона
    imageFileId: string
    imageFile: string

    // Видео фона
    videoFileId: string
    videoFile: string
}
