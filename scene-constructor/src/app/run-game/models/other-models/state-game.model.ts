export class StateGame {

  constructor(
    public id: string,
    public currentScene: string,
    public answer: { id: string; value: string; }[]
  ) {
  }
}
