import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { Player } from 'src/app/models/player.model';
import { SelectMediaFileDialogComponent } from '../../select-media-file-dialog/select-media-file-dialog.component';

@Component({
  selector: 'app-base-edit-scene-dialog',
  templateUrl: './base-edit-scene-dialog.component.html',
  styleUrls: ['./base-edit-scene-dialog.component.scss']
})
export class BaseEditSceneDialogComponent implements OnInit {

  @Input()
  form: FormGroup;

  @Input()
  soundFileLink: FileLink

  @Input()
  dialog: MatDialog

  @Input()
  gameId: string

  @Input()
  players: { player: Player, isSelect: boolean }[]

  @Output()
  close: EventEmitter<any> = new EventEmitter()

  ngOnInit() {
  }

  selectSoundFileLink() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowSounds = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.soundFileLink = item
    });
  }

  deletedSoundFileLink() {
    this.soundFileLink = null
  }

  onNoClick(): void {
    //this.dialogRef.close();

    this.close.emit('')
  }

}
