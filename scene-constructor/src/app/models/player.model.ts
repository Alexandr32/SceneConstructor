import { Entity } from './entity.model';

export class Player implements Entity {

  public imageFile: string

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public imageFileId: string,
  ) {
  }
}
