import {TypeControls} from "./type-controls.enum";
import {ItemPartsPuzzleImage} from "../../../core/models/item-parts-puzzle-image.model";

export class StateGame {
  answer: Array<{playerId: string, answerId: string}> = []
  typeControls: TypeControls = TypeControls.center
  scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  constructor(
    public id: string,
    public currentSceneId: string
  ) {
  }

}

export class StateGameAnswer {

  answer: Array<{playerId: string, answerId: string}> = []

  constructor(
    public id: string
  ) {
  }

}
