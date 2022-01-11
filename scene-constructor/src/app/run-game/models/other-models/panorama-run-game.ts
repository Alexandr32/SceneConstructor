import {IBaseSceneRunGame} from "./base-scene-run-game.model";
import {FileLink} from "../../../core/models/file-link.model.ts";
import {TypeSceneEnum} from "../../../core/models/type-scene.enum";
import {AnswerRunGame} from "./answer.model";

export class PanoramaRunGame implements IBaseSceneRunGame {

    id: string
    title: string
    text: string
    color: string

    soundFileId: string
    soundFile: string
    soundFileLink: FileLink

    typesScene: TypeSceneEnum = TypeSceneEnum.Panorama

    isStartGame: boolean = false

    players: string[] = []

    answers: AnswerRunGame[] = []

    imageFileId: string
    imageFile: string

    isTimer: boolean
    times: number // В мс
}
