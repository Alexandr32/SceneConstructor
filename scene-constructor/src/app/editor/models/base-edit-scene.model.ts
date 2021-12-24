import {Entity} from "../../core/models/entity.model";
import {FileLink} from "../../core/models/file-link.model.ts";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {Coordinate} from "./coordinate.model";
import {Answer} from "./answer.model";

export interface IBaseEditScene extends Entity {
    id: string
    title: string
    text: string
    color: string

    soundFileId: string
    soundFileLink: FileLink

    typesScene: TypeSceneEnum

    isStartGame: boolean
    coordinate: Coordinate
    players: string[]

    answers: Answer[]

    maxCountAnswers: number
}
