import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor/editor.component';
import { SceneComponent } from './editor/scene/scene.component';
import { ToCoordinatesPipe } from './pipe/toсoordinates.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { EditSceneDialogComponent } from './editor/edit-scene-dialog/edit-scene-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPlayerDialogComponent } from './editor/edit-player-dialog/edit-player-dialog.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import { EditImageComponent } from './editor/edit-image-player/edit-image.component';
import { GameListComponent } from './editor/game-list/game-list.component';
import { RunGameModule } from './run-game/run-game.module';
import { CoreModule } from './core/core.module';
import { MainComponent } from './editor/main/main.component';
import { FireModule } from './fire.module';
import { MediaFileDialogComponent } from './editor/media-file-dialog/media-file-dialog.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { SelectMediaFileDialogComponent } from './editor/select-media-file-dialog/select-media-file-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    SceneComponent,
    ToCoordinatesPipe,
    EditSceneDialogComponent,
    EditPlayerDialogComponent,
    EditImageComponent,
    GameListComponent,
    MainComponent,
    MediaFileDialogComponent,
    SelectMediaFileDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    ReactiveFormsModule,
    ImageCropperModule,
    FireModule,
    RunGameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
