import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileLink } from 'src/app/core/models/file-link.model.ts';
import { FileService } from 'src/app/core/services/file.service';
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { SaveMediaFileDialogComponent } from '../save-media-file-dialog/save-media-file-dialog.component';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-select-media-file-dialog',
  templateUrl: './select-media-file-dialog.component.html',
  styleUrls: ['./select-media-file-dialog.component.scss']
})
export class SelectMediaFileDialogComponent implements OnInit {

  @Input()
  isShowImagesPlayer: boolean = false

  @Input()
  isShowImagesScene: boolean = false

  @Input()
  isShowVideosScene: boolean = false

  @Input()
  isShowImagesPanoramas: boolean = false

  @Input()
  isShowImagePuzzle: boolean = false

  @Input()
  isShowSounds: boolean = false

  @Output()
  selectItem = new EventEmitter<FileLink>();

  imagesPlayer: FileLink[] = []
  imagesScene: FileLink[] = []
  videosScene: FileLink[] = []

  imagesPanoramas: FileLink[] = []
  imagePuzzle: FileLink[] = []
  sounds: FileLink[] = []

  private gameId: string

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<SaveMediaFileDialogComponent>,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string
    }) {

    this.gameId = data.gameId
  }

  ngOnInit() {
    this.loadData()
  }

  private async loadData() {

    if (this.isShowImagesScene) {
      this.imagesScene = await this.fileService.getMediaFileLink(this.gameId, TypeFile.SceneImages)

    }

    if (this.isShowImagesPlayer) {
      this.imagesPlayer = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PlayerImages)
    }


    if (this.isShowVideosScene) {
      this.videosScene = await this.fileService.getMediaFileLink(this.gameId, TypeFile.SceneVideos)
    }

    if (this.isShowImagesPanoramas) {
      this.imagesPanoramas = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PanoramaImages)
    }

    if (this.isShowImagePuzzle) {
      this.imagePuzzle = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PuzzleImages)
    }

    if (this.isShowSounds) {
      this.sounds = await this.fileService.getMediaFileLink(this.gameId, TypeFile.Sound)
    }

  }

  selectMediaFile(item: FileLink) {
    this.selectItem.emit(item)
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
