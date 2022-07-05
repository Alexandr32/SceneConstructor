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
  playerScenePartsPuzzleImages: SceneForEditPlayer[] = []

  // Событие выбора
  dragEvent: 'completed' | 'startDragInScene' | 'startDragInPlayer' = 'completed'

  // Номер выбранной ячейки
  selectNumber: number

  // Выбранный номер ячейки у игрока
  //selectNumberPlayer: number
  // Массив у выбранного игрока
  selectPartsPlayer: PartsPuzzleImage[]
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

    const dataForPlayerPartsImages: SceneForEditPlayer[] = this.playerScenePartsPuzzleImages.map((item) => {

      const sceneForEditPlayer = new SceneForEditPlayer()
      sceneForEditPlayer.name = item.name
      sceneForEditPlayer.playerId = item.playerId

      // if(this.imgInPlace1.length > 0) {
      //   sceneForEditPlayer.imgInPlace1 = this.imgInPlace1[0]
      //   sceneForEditPlayer.isDraggableImgPlace1 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace1 = null
      //   sceneForEditPlayer.isDraggableImgPlace1 = true
      // }
      //
      // if(this.imgInPlace2.length > 0) {
      //   sceneForEditPlayer.imgInPlace2 = this.imgInPlace2[0]
      //   sceneForEditPlayer.isDraggableImgPlace2 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace2 = null
      //   sceneForEditPlayer.isDraggableImgPlace2 = true
      // }
      //
      // if(this.imgInPlace3.length > 0) {
      //   sceneForEditPlayer.imgInPlace3 = this.imgInPlace3[0]
      //   sceneForEditPlayer.isDraggableImgPlace3 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace3 = null
      //   sceneForEditPlayer.isDraggableImgPlace3 = true
      // }
      //
      // if(this.imgInPlace4.length > 0) {
      //   sceneForEditPlayer.imgInPlace4 = this.imgInPlace4[0]
      //   sceneForEditPlayer.isDraggableImgPlace4 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace4 = null
      //   sceneForEditPlayer.isDraggableImgPlace4 = true
      // }
      //
      // if(this.imgInPlace5.length > 0) {
      //   sceneForEditPlayer.imgInPlace5 = this.imgInPlace5[0]
      //   sceneForEditPlayer.isDraggableImgPlace5 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace5 = null
      //   sceneForEditPlayer.isDraggableImgPlace5 = true
      // }
      //
      // if(this.imgInPlace6.length > 0) {
      //   sceneForEditPlayer.imgInPlace6 = this.imgInPlace6[0]
      //   sceneForEditPlayer.isDraggableImgPlace6 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace6 = null
      //   sceneForEditPlayer.isDraggableImgPlace6 = true
      // }
      //
      // if(this.imgInPlace7.length > 0) {
      //   sceneForEditPlayer.imgInPlace7 = this.imgInPlace7[0]
      //   sceneForEditPlayer.isDraggableImgPlace7 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace7 = null
      //   sceneForEditPlayer.isDraggableImgPlace7 = true
      // }
      //
      // if(this.imgInPlace8.length > 0) {
      //   sceneForEditPlayer.imgInPlace8 = this.imgInPlace8[0]
      //   sceneForEditPlayer.isDraggableImgPlace8 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace8 = null
      //   sceneForEditPlayer.isDraggableImgPlace8 = true
      // }
      //
      // if(this.imgInPlace9.length > 0) {
      //   sceneForEditPlayer.imgInPlace9 = this.imgInPlace9[0]
      //   sceneForEditPlayer.isDraggableImgPlace9 = false
      // } else {
      //   sceneForEditPlayer.imgInPlace9 = null
      //   sceneForEditPlayer.isDraggableImgPlace9 = true
      // }

      sceneForEditPlayer.imgPlace1 = item.imgPlace1
      sceneForEditPlayer.imgPlace2 = item.imgPlace2
      sceneForEditPlayer.imgPlace3 = item.imgPlace3
      sceneForEditPlayer.imgPlace4 = item.imgPlace4
      sceneForEditPlayer.imgPlace5 = item.imgPlace5
      sceneForEditPlayer.imgPlace6 = item.imgPlace6
      sceneForEditPlayer.imgPlace7 = item.imgPlace7
      sceneForEditPlayer.imgPlace8 = item.imgPlace8
      sceneForEditPlayer.imgPlace9 = item.imgPlace9

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
        value.imgPlace1.length = 0
        value.imgPlace2.length = 0
        value.imgPlace3.length = 0
        value.imgPlace4.length = 0
        value.imgPlace5.length = 0
        value.imgPlace6.length = 0
        value.imgPlace7.length = 0
        value.imgPlace8.length = 0
        value.imgPlace9.length = 0
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
      const currentValues: PartsPuzzleImage[] = this.selectPartsPlayer
      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      this.scenePartsPuzzleImages[numberPosition].push(currentValue[0])
    }

    this.dragEvent = 'completed'
    event.stopPropagation()
  }

  dragOver(event) {
    event.preventDefault()
  }

  dragStarImgPlayer(event, parts: PartsPuzzleImage[], numberSelectImageInCell: number) {
    //this.selectNumberPlayer = numberPosition
    this.selectPartsPlayer = parts
    this.numberSelectImageInCell = numberSelectImageInCell
    this.dragEvent = 'startDragInPlayer'
  }

  dragImgPlayer(event, parts: PartsPuzzleImage[]) {

    if (this.dragEvent === 'startDragInScene') {
      const currentValues: PartsPuzzleImage[] = this.scenePartsPuzzleImages[this.selectNumber]

      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      parts.push(currentValue[0])
    }

    if (this.dragEvent === 'startDragInPlayer') {
      const currentValues: PartsPuzzleImage[] = this.selectPartsPlayer

      const currentValue = currentValues.splice(this.numberSelectImageInCell, 1)
      parts.push(currentValue[0])
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

    const playerScenePartsPuzzleImages: SceneForEditPlayer[]
      = Object.assign([], this.playerScenePartsPuzzleImages);

    this.playerScenePartsPuzzleImages = []

    players.forEach((player) => {
      const res = playerScenePartsPuzzleImages.find((item) => item.playerId === player.id)

      if (res) {
        // Добавляем уже существующую
        this.playerScenePartsPuzzleImages.push(res)
        return
      }

      // Создаем новую область
      const sceneForEditPlayer = new SceneForEditPlayer()
      sceneForEditPlayer.playerId = player.id
      sceneForEditPlayer.name = player.name
      sceneForEditPlayer.imgPlace1 = []
      sceneForEditPlayer.imgPlace2 = []
      sceneForEditPlayer.imgPlace3 = []
      sceneForEditPlayer.imgPlace4 = []
      sceneForEditPlayer.imgPlace5 = []
      sceneForEditPlayer.imgPlace6 = []
      sceneForEditPlayer.imgPlace7 = []
      sceneForEditPlayer.imgPlace8 = []
      sceneForEditPlayer.imgPlace9 = []

      // const newValue = {
      //   scenePartsPuzzleImages: sceneForEditPlayer,
      //   listImg: [
      //     sceneForEditPlayer.imgInPlace1 ? [sceneForEditPlayer.imgInPlace1] : [],
      //     sceneForEditPlayer.imgInPlace2 ? [sceneForEditPlayer.imgInPlace2] : [],
      //     sceneForEditPlayer.imgInPlace3 ? [sceneForEditPlayer.imgInPlace3] : [],
      //     sceneForEditPlayer.imgInPlace4 ? [sceneForEditPlayer.imgInPlace4] : [],
      //     sceneForEditPlayer.imgInPlace5 ? [sceneForEditPlayer.imgInPlace5] : [],
      //     sceneForEditPlayer.imgInPlace6 ? [sceneForEditPlayer.imgInPlace6] : [],
      //     sceneForEditPlayer.imgInPlace7 ? [sceneForEditPlayer.imgInPlace7] : [],
      //     sceneForEditPlayer.imgInPlace8 ? [sceneForEditPlayer.imgInPlace8] : [],
      //     sceneForEditPlayer.imgInPlace9 ? [sceneForEditPlayer.imgInPlace9] : [],
      //   ]
      // }
      this.playerScenePartsPuzzleImages.push(sceneForEditPlayer)
    })

    // Все изображения игроков которые
    // const allImagePlayer: PartsPuzzleImage[] = this.playerScenePartsPuzzleImages.flatMap((playerValue) => {
    //   return playerValue.imgPlace6
    // })

    const allImagePlayer: PartsPuzzleImage[] = []

    this.playerScenePartsPuzzleImages.forEach((item) => {

      item.imgPlace1.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace2.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace3.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace4.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace5.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace6.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace7.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace8.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
      item.imgPlace9.forEach(img => {
        if(img) {
          allImagePlayer.push(img)
        }
      })
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
      values.imgPlace1.length = 0
      values.imgPlace2.length = 0
      values.imgPlace3.length = 0
      values.imgPlace4.length = 0
      values.imgPlace5.length = 0
      values.imgPlace6.length = 0
      values.imgPlace7.length = 0
      values.imgPlace8.length = 0
      values.imgPlace9.length = 0
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
    const list: PartsPuzzleImage[][] = []

    this.playerScenePartsPuzzleImages.forEach(item => {
      list.push(item.imgPlace1)
      list.push(item.imgPlace2)
      list.push(item.imgPlace3)
      list.push(item.imgPlace4)
      list.push(item.imgPlace5)
      list.push(item.imgPlace6)
      list.push(item.imgPlace7)
      list.push(item.imgPlace8)
      list.push(item.imgPlace9)
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
