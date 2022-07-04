import {ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Answer} from 'src/app/editor/models/answer.model';
import {FileLink} from 'src/app/core/models/file-link.model.ts';
import {PuzzleEditScene, SceneForEditPlayer} from 'src/app/editor/models/puzzle-edit-scene';
import {Player} from 'src/app/core/models/player.model';
import {SelectMediaFileDialogComponent} from '../select-media-file-dialog/select-media-file-dialog.component';
import {PartsPuzzleImage} from 'src/app/core/models/parts-puzzle-image.model';
import {FirestoreService} from 'src/app/editor/services/firestore.service';
import {ItemPartsPuzzleImage} from 'src/app/core/models/item-parts-puzzle-image.model';
import {delay, first} from 'rxjs/operators';
import {async} from 'rxjs/internal/scheduler/async';
import {FileService} from 'src/app/core/services/file.service';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CdkDragDrop} from "@angular/cdk/drag-drop/drag-events";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-edit-puzzle-dialog',
  templateUrl: './edit-puzzle-dialog.component.html',
  styleUrls: ['./edit-puzzle-dialog.component.scss'],
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

  // Все изображения
  allImgForScene: PartsPuzzleImage[] = [];

  // Список изображений для сцены
  imgInPlace1: PartsPuzzleImage[] = [];
  imgInPlace2: PartsPuzzleImage[] = [];
  imgInPlace3: PartsPuzzleImage[] = [];
  imgInPlace4: PartsPuzzleImage[] = [];
  imgInPlace5: PartsPuzzleImage[] = [];
  imgInPlace6: PartsPuzzleImage[] = [];
  imgInPlace7: PartsPuzzleImage[] = [];
  imgInPlace8: PartsPuzzleImage[] = [];
  imgInPlace9: PartsPuzzleImage[] = [];

  scenePartsPuzzleImages: PartsPuzzleImage[][] = [
    this.imgInPlace1,
    this.imgInPlace2,
    this.imgInPlace3,
    this.imgInPlace4,
    this.imgInPlace5,
    this.imgInPlace6,
    this.imgInPlace7,
    this.imgInPlace8,
    this.imgInPlace9,
  ]

  // Список изображений для игроков
  playerScenePartsPuzzleImages: { scenePartsPuzzleImages: SceneForEditPlayer, listImg: PartsPuzzleImage[][] }[] = []

  // Событие выбора
  dragEvent: 'completed' | 'startDragInScene' | 'startDragInPlayer' = 'completed'

  // Номер выбранной ячейки
  selectNumber: number

  // Выбранный номер ячейки у игрока
  selectNumberPlayer: number
  // Массив у выбранного игрока
  selectPartsPlayer: PartsPuzzleImage[][]
  // Номер выбранного изображения в ячейке
  numberSelectImageInCell: number

  constructor(public dialogRef: MatDialogRef<EditPuzzleDialogComponent>,
              private firestoreService: FirestoreService,
              private fireStore: AngularFirestore,
              private fileService: FileService,
              @Inject(MAT_DIALOG_DATA) public data: {
                gameId: string,
                scene: PuzzleEditScene,
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

    this.playerScenePartsPuzzleImages = []

    if(this.data.scene.partsPuzzleImages) {
      this.allImgForScene = JSON.parse(JSON.stringify(this.data.scene.partsPuzzleImages));
    }

    if (this.data.scene.imgInPlace1) {
      this.data.scene.imgInPlace1.forEach((img) => {
        this.scenePartsPuzzleImages[0].push(img)
      })
    }
    if (this.data.scene.imgInPlace2) {
      this.data.scene.imgInPlace2.forEach((img) => {
        this.scenePartsPuzzleImages[1].push(img)
      })
    }
    if (this.data.scene.imgInPlace3) {
      this.data.scene.imgInPlace3.forEach((img) => {
        this.scenePartsPuzzleImages[2].push(img)
      })
    }
    if (this.data.scene.imgInPlace4) {
      this.data.scene.imgInPlace4.forEach((img) => {
        this.scenePartsPuzzleImages[3].push(img)
      })
    }
    if (this.data.scene.imgInPlace5) {
      this.data.scene.imgInPlace5.forEach((img) => {
        this.scenePartsPuzzleImages[4].push(img)
      })
    }
    if (this.data.scene.imgInPlace6) {
      this.data.scene.imgInPlace6.forEach((img) => {
        this.scenePartsPuzzleImages[5].push(img)
      })
    }
    if (this.data.scene.imgInPlace7) {
      this.data.scene.imgInPlace7.forEach((img) => {
        this.scenePartsPuzzleImages[6].push(img)
      })
    }
    if (this.data.scene.imgInPlace8) {
      this.data.scene.imgInPlace8.forEach((img) => {
        this.scenePartsPuzzleImages[7].push(img)
      })
    }
    if (this.data.scene.imgInPlace9) {
      this.data.scene.imgInPlace9.forEach((img) => {
        this.scenePartsPuzzleImages[8].push(img)
      })
    }

    this.data.scene.dataForPlayerPartsImages.forEach((value) => {

      this.playerScenePartsPuzzleImages.push(
        {
          scenePartsPuzzleImages: value,

          // Получение загруженных картинок
          listImg: [
            value.imgInPlace1 ? [value.imgInPlace1] : [],
            value.imgInPlace2 ? [value.imgInPlace2] : [],
            value.imgInPlace3 ? [value.imgInPlace3] : [],
            value.imgInPlace4 ? [value.imgInPlace4] : [],
            value.imgInPlace5 ? [value.imgInPlace5] : [],
            value.imgInPlace6 ? [value.imgInPlace6] : [],
            value.imgInPlace7 ? [value.imgInPlace7] : [],
            value.imgInPlace8 ? [value.imgInPlace8] : [],
            value.imgInPlace9 ? [value.imgInPlace9] : [],
          ]
        }
      )

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

    this.data.scene.partsPuzzleImages = this.allImgForScene

    this.data.scene.imgInPlace1 = this.imgInPlace1
    this.data.scene.imgInPlace2 = this.imgInPlace2
    this.data.scene.imgInPlace3 = this.imgInPlace3
    this.data.scene.imgInPlace4 = this.imgInPlace4
    this.data.scene.imgInPlace5 = this.imgInPlace5
    this.data.scene.imgInPlace6 = this.imgInPlace6
    this.data.scene.imgInPlace7 = this.imgInPlace7
    this.data.scene.imgInPlace8 = this.imgInPlace8
    this.data.scene.imgInPlace9 = this.imgInPlace9

    const dataForPlayerPartsImages: SceneForEditPlayer[] = this.playerScenePartsPuzzleImages.map(item => {

      const sceneForEditPlayer = new SceneForEditPlayer()
      sceneForEditPlayer.name = item.scenePartsPuzzleImages.name
      sceneForEditPlayer.playerId = item.scenePartsPuzzleImages.playerId

      sceneForEditPlayer.imgInPlace1 = item.listImg[0][0] ? item.listImg[0][0] : null
      sceneForEditPlayer.imgInPlace2 = item.listImg[1][0] ? item.listImg[1][0] : null
      sceneForEditPlayer.imgInPlace3 = item.listImg[2][0] ? item.listImg[2][0] : null
      sceneForEditPlayer.imgInPlace4 = item.listImg[3][0] ? item.listImg[2][0] : null
      sceneForEditPlayer.imgInPlace5 = item.listImg[4][0] ? item.listImg[4][0] : null
      sceneForEditPlayer.imgInPlace6 = item.listImg[5][0] ? item.listImg[5][0] : null
      sceneForEditPlayer.imgInPlace7 = item.listImg[6][0] ? item.listImg[6][0] : null
      sceneForEditPlayer.imgInPlace8 = item.listImg[7][0] ? item.listImg[7][0] : null
      sceneForEditPlayer.imgInPlace9 = item.listImg[8][0] ? item.listImg[8][0] : null

      return sceneForEditPlayer
    })

    this.data.scene.dataForPlayerPartsImages = dataForPlayerPartsImages

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
      data: {gameId: this.gameId}
    });

    dialogRef.componentInstance.isShowImagePuzzle = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {

      this.imgInPlace1.length = 0
      this.imgInPlace2.length = 0
      this.imgInPlace3.length = 0
      this.imgInPlace4.length = 0
      this.imgInPlace5.length = 0
      this.imgInPlace6.length = 0
      this.imgInPlace7.length = 0
      this.imgInPlace8.length = 0
      this.imgInPlace9.length = 0

      this.playerScenePartsPuzzleImages.forEach(value => {
        value.listImg[0].length = 0
        value.listImg[1].length = 0
        value.listImg[2].length = 0
        value.listImg[3].length = 0
        value.listImg[4].length = 0
        value.listImg[5].length = 0
        value.listImg[6].length = 0
        value.listImg[7].length = 0
        value.listImg[8].length = 0
      })

      this.allImgForScene = []

      this.imgPuzzleFile = item.url
      this.imagePuzzleFileId = item.id

      for (let i: number = 1; i <= 9; i++) {

        const partsPuzzleImage = new PartsPuzzleImage()
        partsPuzzleImage.id = i

        this.fileService
          .getUplPartsPuzzleImages(this.data.gameId, item.id, partsPuzzleImage)
          .toPromise()
          .then(src => {
            partsPuzzleImage.src = src
          })

        this.scenePartsPuzzleImages[i - 1].push(partsPuzzleImage)

        this.allImgForScene.push(partsPuzzleImage)

      }
    });
  }

  onClickDeletedImg() {
    this.imgPuzzleFile = '';
    this.imagePuzzleFileId = ''

    this.resetParts()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  dragStarImg(event, numberPosition: number, numberSelectImageInCell: number) {
    this.selectNumber = numberPosition
    this.dragEvent = 'startDragInScene'
    this.numberSelectImageInCell = numberSelectImageInCell
  }

  dragImg(event, numberPosition: number) {

    // Перетаскивание началось с области сцены
    if (this.dragEvent === 'startDragInScene') {
      const currentValues: PartsPuzzleImage[] = this.scenePartsPuzzleImages[this.selectNumber]
      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      this.scenePartsPuzzleImages[numberPosition].push(currentValue[0])
    }

    // Перетаскивание началось с области играка
    if (this.dragEvent === 'startDragInPlayer') {
      const currentValues: PartsPuzzleImage[] = this.selectPartsPlayer[this.selectNumberPlayer]
      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      this.scenePartsPuzzleImages[numberPosition].push(currentValue[0])
    }

    this.dragEvent = 'completed'
    event.stopPropagation()
  }

  dragOver(event) {
    event.preventDefault()
  }

  dragStarImgPlayer(event, numberPosition: number, parts: PartsPuzzleImage[][], numberSelectImageInCell: number) {
    this.selectNumberPlayer = numberPosition
    this.selectPartsPlayer = parts
    this.numberSelectImageInCell = numberSelectImageInCell
    this.dragEvent = 'startDragInPlayer'
  }

  dragImgPlayer(event, numberPosition: number, parts: PartsPuzzleImage[][]) {

    if (this.dragEvent === 'startDragInScene') {
      const currentValues: PartsPuzzleImage[] = this.scenePartsPuzzleImages[this.selectNumber]

      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      parts[numberPosition].push(currentValue[0])
    }

    if (this.dragEvent === 'startDragInPlayer') {
      const currentValues: PartsPuzzleImage[] = this.selectPartsPlayer[this.selectNumberPlayer]

      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      parts[numberPosition].push(currentValue[0])
    }

    this.dragEvent = 'completed'

    this.validationPlayerImage()

    event.stopPropagation()
  }

  eventChangeSelectPlayers() {

    const players = this.selectPlayers
      .filter(item => {
        if (item.isSelect) {
          return item.player
        }
      })
      .map(item => item.player)

    const playerScenePartsPuzzleImages: { scenePartsPuzzleImages: SceneForEditPlayer, listImg: PartsPuzzleImage[][] }[]
      = Object.assign([], this.playerScenePartsPuzzleImages);

    this.playerScenePartsPuzzleImages = []

    players.forEach((player) => {
      const res = playerScenePartsPuzzleImages.find((item) => item.scenePartsPuzzleImages.playerId === player.id)

      if (res) {
        // Добавляем уже существующую
        this.playerScenePartsPuzzleImages.push(res)
        return
      }

      // Создаем новую область
      const sceneForEditPlayer = new SceneForEditPlayer()
      sceneForEditPlayer.playerId = player.id
      sceneForEditPlayer.name = player.name

      const newValue = {
        scenePartsPuzzleImages: sceneForEditPlayer,
        listImg: [
          sceneForEditPlayer.imgInPlace1 ? [sceneForEditPlayer.imgInPlace1] : [],
          sceneForEditPlayer.imgInPlace2 ? [sceneForEditPlayer.imgInPlace2] : [],
          sceneForEditPlayer.imgInPlace3 ? [sceneForEditPlayer.imgInPlace3] : [],
          sceneForEditPlayer.imgInPlace4 ? [sceneForEditPlayer.imgInPlace4] : [],
          sceneForEditPlayer.imgInPlace5 ? [sceneForEditPlayer.imgInPlace5] : [],
          sceneForEditPlayer.imgInPlace6 ? [sceneForEditPlayer.imgInPlace6] : [],
          sceneForEditPlayer.imgInPlace7 ? [sceneForEditPlayer.imgInPlace7] : [],
          sceneForEditPlayer.imgInPlace8 ? [sceneForEditPlayer.imgInPlace8] : [],
          sceneForEditPlayer.imgInPlace9 ? [sceneForEditPlayer.imgInPlace9] : [],
        ]
      }
      this.playerScenePartsPuzzleImages.push(newValue)
    })

    // Все изображения игроков которые
    const allImagePlayer: PartsPuzzleImage[] = this.playerScenePartsPuzzleImages.flatMap((playerValue) => {
      return playerValue.listImg.flatMap((item) => item)
    })

    // Все изображения которые есть на сцене
    const allImgInScene: PartsPuzzleImage[] = this.scenePartsPuzzleImages.flatMap((value) => {
      return value
    })

    // Проверяем есть ли не используемые фото
    this.allImgForScene.forEach((img) => {

      const t1 = allImagePlayer.find(value => value.id === img.id)
      const t2 = allImgInScene.find(value => value.id === img.id)
      // Если картинки нет у игрока и на сцене пихаем ее в конец сцены
      if (!t1 && !t2) {
        this.scenePartsPuzzleImages[8].push(img)
      }

    })

    this.validationPlayerImage()
  }

  resetParts() {
    this.allImgForScene.forEach((item, index: number) => {
      this.scenePartsPuzzleImages[index].length = 0
      this.scenePartsPuzzleImages[index].push(item)
    })

    this.playerScenePartsPuzzleImages.forEach((values) => {
      values.listImg.forEach((img) => {
        img.length = 0
      })
    })

  }

  openSelectBackgroundImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: {gameId: this.gameId}
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
      data: {gameId: this.gameId}
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

  validationPlayerImage() {
    const list = this.playerScenePartsPuzzleImages
      .flatMap(item => {
        return item.listImg
      })


    for (let item of list) {
      if (item.length > 1) {
        this.validData = false
        break;
      } else {
        this.validData = true
      }
    }
  }
}
