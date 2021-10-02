import { Scene } from './scene.model';
import { Player } from './player.model';
import { Entity } from './entity.model';

export class Game implements Entity {
  constructor(
    public id: string,
    public number: number,
    public name: string,
    public description: string,
    public scenes: Scene[],
    public players: Player[],
  ) {
  }

}
