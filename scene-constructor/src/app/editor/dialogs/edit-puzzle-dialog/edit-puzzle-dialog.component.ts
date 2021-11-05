import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Answer } from 'src/app/models/answer.model';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { AngularFirestore } from '@angular/fire/firestore';
import { Puzzle } from 'src/app/models/scene.model';
import { Player } from 'src/app/models/player.model';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';
import { PartsPuzzleImage } from 'src/app/models/parts-puzzle-image.model';
import { FirestoreService } from 'src/app/serveces/firestore.service';

@Component({
  selector: 'app-edit-puzzle-dialog',
  templateUrl: './edit-puzzle-dialog.component.html',
  styleUrls: ['./edit-puzzle-dialog.component.scss']
})
export class EditPuzzleDialogComponent implements OnInit {


  validData: boolean = true

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup = new FormGroup({})

  formAnswer: FormGroup = new FormGroup({})

  imgFile: string;
  imageFileId: string

  answers: Answer[] = [];

  soundFileLink: FileLink

  gameId: string

  partsPuzzleImages: PartsPuzzleImage[]


  constructor(public dialogRef: MatDialogRef<EditPuzzleDialogComponent>,
    private firestoreService: FirestoreService,
    private fireStore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string,
      scene: Puzzle,
      players: Player[]
    },
    public dialog: MatDialog) {

    this.gameId = data.gameId
  }

  ngOnInit() {

    if (this.data.scene.imageFile) {
      this.imgFile = this.data.scene.imageFile;
      this.imageFileId = this.data.scene.imageFileId
    }

    if (this.data.scene.soundFileLink) {
      this.soundFileLink = this.data.scene.soundFileLink
    }

    this.partsPuzzleImages = this.data.scene.partsPuzzleImages


    this.data.scene.answers.forEach(item => {
      this.answers.push(item);
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.scene.answers = this.answers;

    this.data.scene.imageFileId = this.imageFileId;
    this.data.scene.imageFile = this.imgFile;

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  async openSelectImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagePuzzle = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.imgFile = item.url
      this.imageFileId = item.id


      this.partsPuzzleImages.forEach(async item => {
        item.src = await this.firestoreService.getUplPartsPuzzleImages(this.data.gameId, this.imageFileId, item).toPromise()
      })

    });
  }

  onClickDeletedImg() {
    this.imgFile = '';
    this.imageFileId = ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
