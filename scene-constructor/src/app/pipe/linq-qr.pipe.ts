import {Inject, Pipe, PipeTransform} from '@angular/core';
import {Player} from "../core/models/player.model";
import {DOCUMENT} from "@angular/common";

@Pipe({
  name: 'linqQr'
})
export class LinqQrPipe implements PipeTransform {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  transform(player: Player, ...stateGameIdArgs: unknown[]): string {
    return `http://${this.document.location.host}/game-player/${stateGameIdArgs[0]}/${player.id}`
  }

}
