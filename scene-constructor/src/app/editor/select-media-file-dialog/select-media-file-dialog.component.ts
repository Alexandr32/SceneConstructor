import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { FirestoreService } from 'src/app/serveces/firestore.service';
import { MediaFileDialogComponent } from '../media-file-dialog/media-file-dialog.component';

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

  @Output()
  selectItem = new EventEmitter<{ id: string, url: string }>();

  imagesPlayer: FileLink[] = []
  imagesScene: FileLink[] = []
  videosScene: FileLink[] = []

  private gameId: string

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<MediaFileDialogComponent>,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
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
      this.imagesScene = await this.firestoreService.getMediaFileLink(this.gameId, 'SceneImage')

    }

    if (this.isShowImagesPlayer) {
      this.imagesPlayer = await this.firestoreService.getMediaFileLink(this.gameId, 'PlayerImage')
    }


    if (this.isShowVideosScene) {
      this.videosScene = await this.firestoreService.getMediaFileLink(this.gameId, 'SceneVideo')
    }
  }

  selectMediaFile(item: { id: string, url: string }) {
    this.selectItem.emit(item)
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
