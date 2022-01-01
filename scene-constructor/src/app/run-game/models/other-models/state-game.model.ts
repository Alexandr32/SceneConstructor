import {TypeControls} from "./type-controls.enum";

export class StateGame {
  answer: Array<{playerId: string, answerId: string}> = []
  typeControls: TypeControls = TypeControls.center

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
