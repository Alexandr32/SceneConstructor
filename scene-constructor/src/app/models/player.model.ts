import {Entity} from './entity.model';

export class Player implements Entity  {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public imageFile: string,
    public videoFile: string
  ) {
  }
}
