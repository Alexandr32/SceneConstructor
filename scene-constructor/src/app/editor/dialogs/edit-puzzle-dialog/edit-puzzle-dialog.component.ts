import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
import { ItemPartsPuzzleImage } from 'src/app/models/item-parts -puzzle-image.model';

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

  selectPlayers: { player: Player, isSelect: boolean }[] = [];

  scenePartsPuzzleImages: ItemPartsPuzzleImage[] = [
    { number: 1, value: { id: 1, src: '/assets/http_puzzle_1.png' } as PartsPuzzleImage },
    { number: 2, value: { id: 2, src: '/assets/http_puzzle_2.png' } as PartsPuzzleImage },
    { number: 3, value: { id: 3, src: '/assets/http_puzzle_3.png' } as PartsPuzzleImage },
    { number: 4, value: { id: 4, src: '/assets/http_puzzle_4.png' } as PartsPuzzleImage },
    { number: 5, value: { id: 5, src: '/assets/http_puzzle_5.png' } as PartsPuzzleImage },
    { number: 6, value: { id: 6, src: '/assets/http_puzzle_6.png' } as PartsPuzzleImage },
    { number: 7, value: { id: 7, src: '/assets/http_puzzle_7.png' } as PartsPuzzleImage },
    { number: 8, value: { id: 8, src: '/assets/http_puzzle_8.png' } as PartsPuzzleImage },
    { number: 9, value: { id: 9, src: '/assets/http_puzzle_9.png' } as PartsPuzzleImage },
  ]

  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = [
    {
      playerId: '1', scenePartsPuzzleImages: [
        { number: 1, value: null },
        { number: 2, value: null },
        { number: 3, value: null },
        { number: 4, value: null },
        { number: 5, value: null },
        { number: 6, value: null },
        { number: 7, value: null },
        { number: 8, value: null },
        { number: 9, value: null },
      ]
    },
    {
      playerId: '2', scenePartsPuzzleImages: [
        { number: 1, value: null },
        { number: 2, value: null },
        { number: 3, value: null },
        { number: 4, value: null },
        { number: 5, value: null },
        { number: 6, value: null },
        { number: 7, value: null },
        { number: 8, value: null },
        { number: 9, value: null },
      ]
    },
    {
      playerId: '3', scenePartsPuzzleImages: [
        { number: 1, value: null },
        { number: 2, value: null },
        { number: 3, value: null },
        { number: 4, value: null },
        { number: 5, value: null },
        { number: 6, value: null },
        { number: 7, value: null },
        { number: 8, value: null },
        { number: 9, value: null },
      ]
    },
    {
      playerId: '4', scenePartsPuzzleImages: [
        { number: 1, value: null },
        { number: 2, value: null },
        { number: 3, value: null },
        { number: 4, value: null },
        { number: 5, value: null },
        { number: 6, value: null },
        { number: 7, value: null },
        { number: 8, value: null },
        { number: 9, value: null },
      ]
    }
  ]


  constructor(public dialogRef: MatDialogRef<EditPuzzleDialogComponent>,
    private firestoreService: FirestoreService,
    private changeDetection: ChangeDetectorRef,
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
    this.scenePartsPuzzleImages = this.data.scene.partsPuzzleImages.map((item, index) => {
      return {
        number: index + 1,
        value: {
          id: item.id,
          src: item.src
        } as PartsPuzzleImage
      }
    })


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

        try {

          item.src = await this.firestoreService.getUplPartsPuzzleImages(this.data.gameId, this.imageFileId, item).toPromise()

        } catch (error) {

          console.log('При получении элементов головоломки произошла ошибка');
          item.src = `/assets/http_puzzle_${item.id}.png`;

        }


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

  selectPartsPuzzleImage: ItemPartsPuzzleImage = null

  // Вызывается при старте перетаскивания
  dragStar(event, value: ItemPartsPuzzleImage) {
    this.selectPartsPuzzleImage = value
  }

  dragOver(event, value: ItemPartsPuzzleImage) {
    event.preventDefault()
  }

  private setValueCurrentPartsPuzzleImage(value: ItemPartsPuzzleImage) {
    if (value.value) {

      if (this.selectPartsPuzzleImage.value) {
        value.value.id = this.selectPartsPuzzleImage.value.id
        value.value.src = this.selectPartsPuzzleImage.value.src
      } else {
        value.value = null
      }

      return
    }

    if (this.selectPartsPuzzleImage.value) {
      value.value = {
        id: this.selectPartsPuzzleImage.value.id,
        src: this.selectPartsPuzzleImage.value.src
      }
    } else {
      value.value = null
    }
  }

  private setValueSelectPartsPuzzleImage(oldId: number, oldSrc: string) {

    if (oldSrc) {
      if (this.selectPartsPuzzleImage.value) {
        this.selectPartsPuzzleImage.value.id = oldId
        this.selectPartsPuzzleImage.value.src = oldSrc
      } else {
        this.selectPartsPuzzleImage.value = {
          id: oldId,
          src: oldSrc
        }
      }

      return

    }

    this.selectPartsPuzzleImage.value = null

  }

  /**
   * Срабатывает при отпускании перетаскивания
   * @param event
   * @param value Значение ячейки на котором было произведено отпускание
   */
  drop(event, value: ItemPartsPuzzleImage) {

    const oldId = value.value?.id
    const oldSrc = value.value?.src

    this.setValueCurrentPartsPuzzleImage(value)

    this.setValueSelectPartsPuzzleImage(oldId, oldSrc)
  }

  /**
   *  Срабатывает когда картинка возвращается от игрока на сцену
   * @param event
   * @param value
   */
  dropScene(event, value: ItemPartsPuzzleImage) {

    if (!this.selectPartsPuzzleImage.value) {
      return
    }

    const part = this.scenePartsPuzzleImages.find(item => item.number === this.selectPartsPuzzleImage.value.id)

    part.value = this.selectPartsPuzzleImage.value

    this.selectPartsPuzzleImage.value = null
  }

}
