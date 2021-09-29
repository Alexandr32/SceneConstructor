class Game {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public scenes: Scene[],
    public players: Player[],
  ) {
  }
}

class Answer {
  constructor(
    public id: string,
    public text: string,
    public position: number,
    public parentScene: Scene,
    public sceneId: string) { }
}

class Scene {

  constructor(
    public id: string,
    public title: string,
    public text: string,
    public imageFileId: string,
    public videoFileId: string,
    public answers: Answer[] = [],
    public players: string[] = [],

    public isStartGame: boolean,
  ) {

  }

  imageFile: string = ''
  videoFile: string = ''
}
class Player {

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public imageFileId: string
  ) { }

  public imageFile: string = ''
}

class StateGame {

  constructor(
    public id: string,
    public currentScene: string,
    public answer: { id: string, value: string }[],
  ) {

  }
}

export { Game, Answer, Scene, Player, StateGame };
