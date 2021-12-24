import {IBaseEditScene} from "./base-edit-scene.model";
import {FileLink} from "../../core/models/file-link.model.ts";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {Coordinate} from "./coordinate.model";
import {Answer} from "./answer.model";

export class PanoramaEditScene implements IBaseEditScene {

    id: string
    title: string
    text: string
    color: string

    soundFileId: string
    soundFileLink: FileLink

    typesScene: TypeSceneEnum = TypeSceneEnum.Panorama

    isStartGame: boolean = false
    coordinate: Coordinate
    players: string[] = []

    answers: Answer[] = []
    maxCountAnswers: number = 1

    imageFileId: string
    imageFile: string

    isTimer: boolean
    times: number // В мс
}
