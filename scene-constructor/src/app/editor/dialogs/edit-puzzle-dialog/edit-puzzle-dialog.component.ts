import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Answer } from 'src/app/editor/models/answer.model';
import { FileLink } from 'src/app/core/models/file-link.model.ts';
import { AngularFirestore } from '@angular/fire/firestore';
import { Puzzle } from 'src/app/editor/models/scenes.models';
import { Player } from 'src/app/core/models/player.model';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';
import { PartsPuzzleImage } from 'src/app/core/models/parts-puzzle-image.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { ItemPartsPuzzleImage } from 'src/app/core/models/item-parts-puzzle-image.model';
import { delay, first } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-edit-puzzle-dialog',
  templateUrl: './edit-puzzle-dialog.component.html',
  styleUrls: ['./edit-puzzle-dialog.component.scss']
})
export class EditPuzzleDialogComponent implements OnInit {


  validData: boolean = true;

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup = new FormGroup({})

  formAnswer: FormGroup = new FormGroup({})

  imgPuzzleFile: string;
  imagePuzzleFileId: string

  // Фоновое изображение
  imgFile: string;
  imageFileId: string

  // Фоновое видео
  videoSources: string[] = [];
  videoFileId: string

  answers: Answer[] = [];

  soundFileLink: FileLink

  gameId: string

  selectPlayers: { player: Player, isSelect: boolean }[] = [];

  // Список изображений для сцены
  scenePartsPuzzleImages: ItemPartsPuzzleImage[] = []

  // Список изображений для игроков
  playerScenePartsPuzzleImages: { playerId: string, name: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = []

  selectPartsPuzzleImage: {
    select: ItemPartsPuzzleImage,
    type: 'scene' | 'player' | null
  } = {
      select: null,
      type: null
    }

  constructor(public dialogRef: MatDialogRef<EditPuzzleDialogComponent>,
    private firestoreService: FirestoreService,
    private fireStore: AngularFirestore,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string,
      scene: Puzzle,
      players: Player[]
    },
    public dialog: MatDialog) {

    this.gameId = data.gameId
  }

  ngOnInit() {

    if (this.data.scene.imagePuzzleFile) {
      this.imgPuzzleFile = this.data.scene.imagePuzzleFile;
      this.imagePuzzleFileId = this.data.scene.imagePuzzleFileId
    }

    if (this.data.scene.soundFileLink) {
      this.soundFileLink = this.data.scene.soundFileLink
    }

    if (this.data.scene.imageFile) {
      this.videoSources.push(this.data.scene.videoFile);
      this.videoFileId = this.data.scene.videoFileId
    }

    if (this.data.scene.imageFile) {
      this.imgFile = this.data.scene.imageFile;
      this.imageFileId = this.data.scene.imageFileId
    }

    if (this.data.scene.scenePartsPuzzleImages) {
      this.scenePartsPuzzleImages = JSON.parse(JSON.stringify(this.data.scene.scenePartsPuzzleImages));
    }

    this.playerScenePartsPuzzleImages = []

    const playerScenePartsPuzzleImages = JSON.parse(JSON.stringify(this.data.scene.playerScenePartsPuzzleImages));

    this.data.scene.players.forEach(playerId => {

      const res = playerScenePartsPuzzleImages.find(item => item.playerId === playerId)
      const name = this.data.players.find(item => item.id === playerId).name

      const value = {
        playerId: playerId,
        name: name,
        scenePartsPuzzleImages:
          res
            ? res.scenePartsPuzzleImages
            : [
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

      this.playerScenePartsPuzzleImages.push(value)
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

    this.data.scene.imagePuzzleFileId = this.imagePuzzleFileId;
    this.data.scene.imagePuzzleFile = this.imgPuzzleFile;

    this.data.scene.scenePartsPuzzleImages = this.scenePartsPuzzleImages

    this.data.scene.playerScenePartsPuzzleImages = this.playerScenePartsPuzzleImages

    this.data.scene.imageFileId = this.imageFileId;
    this.data.scene.imageFile = this.imgFile;

    this.data.scene.videoFileId = this.videoFileId
    if (this.videoFileId) {
      this.data.scene.videoFile = this.videoSources[0];
    } else {
      this.data.scene.videoFile = ''
    }

    console.log(this.data.scene)

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  async openSelectImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagePuzzle = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {

      this.resetParts()

      this.imgPuzzleFile = item.url
      this.imagePuzzleFileId = item.id

      const partsPuzzleImages: ItemPartsPuzzleImage[] = []

      for (let i: number = 1; i <= 9; i++) {

        const partsPuzzleImage = new PartsPuzzleImage()
        partsPuzzleImage.id = i
        this.fileService
          .getUplPartsPuzzleImages(this.data.gameId, item.id, partsPuzzleImage)
          .toPromise()
          .then(src => {
            partsPuzzleImage.src = src
          })

        const itemPartsPuzzleImage = {
          number: i,
          value: partsPuzzleImage
        } as ItemPartsPuzzleImage;

        partsPuzzleImages.push(itemPartsPuzzleImage)
      }

      this.scenePartsPuzzleImages = partsPuzzleImages
    });
  }

  onClickDeletedImg() {
    this.imgPuzzleFile = '';
    this.imagePuzzleFileId = ''

    this.resetParts()

    this.scenePartsPuzzleImages = []
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Вызывается при старте перетаскивания
  dragStar(event, value: ItemPartsPuzzleImage, type: 'scene' | 'player' | null) {
    this.selectPartsPuzzleImage.select = value
    this.selectPartsPuzzleImage.type = type
  }

  dragOver(event, value: ItemPartsPuzzleImage) {
    event.preventDefault()
  }

  private setValueCurrentPartsPuzzleImage(value: ItemPartsPuzzleImage) {
    if (value.value) {

      if (this.selectPartsPuzzleImage.select.value) {
        value.value.id = this.selectPartsPuzzleImage.select.value.id
        value.value.src = this.selectPartsPuzzleImage.select.value.src
      } else {
        value.value = null
      }

      return
    }

    if (this.selectPartsPuzzleImage.select.value) {
      value.value = {
        id: this.selectPartsPuzzleImage.select.value.id,
        src: this.selectPartsPuzzleImage.select.value.src
      }
    } else {
      value.value = null
    }
  }

  /**
   * Срабатывает при отпускании перетаскивания
   * @param event
   * @param value Значение ячейки на котором было произведено отпускание
   */
  drop(event, value: ItemPartsPuzzleImage) {

    if (value.value) {
      return
    }

    this.setValueCurrentPartsPuzzleImage(value)
    this.selectPartsPuzzleImage.select.value = null
  }

  /**
   *  Срабатывает когда картинка возвращается от игрока на сцену
   * @param event
   * @param value
   */
  dropScene(event, value: ItemPartsPuzzleImage) {

    if (!this.selectPartsPuzzleImage.select.value) {
      return
    }

    const part = this.scenePartsPuzzleImages.find(item => item.number === this.selectPartsPuzzleImage.select.value.id)

    part.value = this.selectPartsPuzzleImage.select.value

    if (this.selectPartsPuzzleImage.type === 'player') {
      this.selectPartsPuzzleImage.select.value = null
      this.selectPartsPuzzleImage.type = null
    }
  }

  eventChangeSelectPlayers() {

    const playerScenePartsPuzzleImages = Object.assign([], this.playerScenePartsPuzzleImages);

    this.playerScenePartsPuzzleImages = []

    const players = this.selectPlayers
      .filter(item => {
        if (item.isSelect) {
          return item.player
        }
      })
      .map(item => item.player)

    players.forEach(player => {

      const res = playerScenePartsPuzzleImages.find(item => item.playerId === player.id)

      if (res) {
        // Добавляем уже существующую
        this.playerScenePartsPuzzleImages.push(res)
        return
      }

      // Создаем новую
      const value = {
        playerId: player.id,
        name: player.name,
        scenePartsPuzzleImages:
          [
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

      this.playerScenePartsPuzzleImages.push(value)
    })

    // Проверяем есть ли не используемые фото
    const differencePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] =
      playerScenePartsPuzzleImages
        .filter(x => !this.playerScenePartsPuzzleImages
          .includes(x));

    // Вложения
    const differenceScenePartsPuzzleImages = differencePartsPuzzleImages.flatMap(item => {
      return item.scenePartsPuzzleImages.filter(p => p.value)
    })

    differenceScenePartsPuzzleImages.forEach(item => {
      // Обнуляем данные у сцены
      const findEl = this.scenePartsPuzzleImages.find(p => p.number === item.value.id)
      if (findEl) {
        findEl.value = item.value
      }
    })

  }

  resetParts() {
    this.scenePartsPuzzleImages = this.data.scene.partsPuzzleImages?.map((item, index) => {
      return {
        number: index + 1,
        value: {
          id: item.id,
          src: item.src
        } as PartsPuzzleImage
      }
    })

    this.playerScenePartsPuzzleImages.forEach(item => {
      item.scenePartsPuzzleImages.forEach(parts => {
        parts.value = null
      })
    })
  }

  openSelectBackgroundImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagesScene = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.imgFile = item.url
      this.imageFileId = item.id
    });
  }

  onClickDeletedBackgroundImg() {
    this.imgFile = '';
    this.imageFileId = ''
  }

  openSelectBackgroundVideoFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowVideosScene = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.videoSources = []
      this.videoSources.push(item.url)
      this.videoFileId = item.id
    });
  }

  onClickBackgroundDeletedVideo() {
    this.videoFileId = ''
    this.videoSources = []
  }

  toggleVideo() {
    //this.videoPlayer.nativeElement.play()
  }
}
