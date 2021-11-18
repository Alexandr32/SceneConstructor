import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Answer } from 'src/app/models/answer.model';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { Player } from 'src/app/models/player.model';
import { Scene } from 'src/app/models/scene.model';
import { SelectMediaFileDialogComponent } from '../../dialogs/select-media-file-dialog/select-media-file-dialog.component';

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
  validData: boolean

  @Input()
  players: { player: Player, isSelect: boolean }[] = [];

  @Output()
  changeSelectPlayers: EventEmitter<any> = new EventEmitter<any>()

  answers: Answer[] = [];

  @Output()
  close: EventEmitter<any> = new EventEmitter()

  @Output()
  save: EventEmitter<any> = new EventEmitter()

  @Input()
  data: {
    gameId: string,
    scene: Scene,
    players: Player[]
  }

  ngOnInit() {
    this.form.addControl('title',
      new FormControl(
        this.data.scene.title,
        [
          Validators.required
        ]));

    this.form.addControl('text',
      new FormControl(
        this.data.scene.text,
        [
          Validators.required
        ]));

    this.form.addControl('isStartGame',
      new FormControl(
        this.data.scene.isStartGame
      ));

    this.form.addControl('color',
      new FormControl(
        this.data.scene.color
      ));

    this.data.players.forEach((item) => {

      const isSelect = this.data.scene.players.includes(item.id);


      const player = { player: item, isSelect: isSelect }

      this.form.addControl(`playerId${item.id}`,
        new FormControl(
          isSelect,
          [
            Validators.required
          ]));


      this.players.push(player);

      this.form.controls[`playerId${item.id}`].valueChanges.subscribe(value => {
        player.isSelect = value
        this.changeSelectPlayers.emit()
      })
    });
  }

  selectSoundFileLink() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.data.gameId }
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
    this.close.emit('')
  }

  onClickSave() {

    if (this.form.invalid) {
      return;
    }

    this.data.scene.title = this.form.value['title'];
    this.data.scene.text = this.form.value['text'];
    this.data.scene.color = this.form.value['color'];
    this.data.scene.isStartGame = this.form.value['isStartGame'];

    const player = this.players.filter(item => {
      return this.form.value[`playerId${item.player.id}`];
    }).map(item => {
      return item.player.id;
    });

    this.data.scene.soundFileLink = this.soundFileLink

    this.data.scene.players = player;


    this.save.emit('')
  }

}
