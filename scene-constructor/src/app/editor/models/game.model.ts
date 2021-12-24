import { Player } from '../../core/models/player.model';
import { Entity } from '../../core/models/entity.model';
import {IBaseEditScene} from "./base-edit-scene.model";

export class Game implements Entity {
  constructor(
    public id: string,
    public number: number,
    public name: string,
    public description: string,
    public scenes: IBaseEditScene[],
    public players: Player[],
  ) {
  }

}
