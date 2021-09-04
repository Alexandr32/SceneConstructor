import {Scene} from './scene.model';
import {Player} from './player.model';

export class Game {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public scenes: Scene[],
    public players: Player[],
  ) {
  }

}
