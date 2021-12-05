export class Player {

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public imageFileId: string
  ) { }

  public imageFile: string = '';
}
