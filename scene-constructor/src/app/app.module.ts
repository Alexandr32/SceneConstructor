import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SETTINGS as AUTH_SETTINGS} from '@angular/fire/compat/auth';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor/editor.component';
import {SceneComponent} from './editor/scene/scene.component';
import {ToCoordinatesPipe} from './pipe/toсoordinates.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImageCropperModule} from 'ngx-img-cropper';
import {GameListComponent} from './editor/game-list/game-list.component';
import {RunGameModule} from './run-game/run-game.module';
import {CoreModule} from './core/core.module';
import {MainComponent} from './editor/main/main.component';
import {FireModule} from './fire.module';
import {SaveMediaFileDialogComponent} from './editor/dialogs/save-media-file-dialog/save-media-file-dialog.component';
import {CommonModule} from '@angular/common';
import {ItemGameComponent} from './editor/item-game/item-game.component';
import {BaseEditSceneDialogComponent} from './editor/shared/base-edit-scene-dialog/base-edit-scene-dialog.component';
import {EditSceneDialogComponent} from './editor/dialogs/edit-scene-dialog/edit-scene-dialog.component';
import {EditImageComponent} from './editor/dialogs/edit-image-player/edit-image.component';
import {EditPlayerDialogComponent} from './editor/dialogs/edit-player-dialog/edit-player-dialog.component';
import {
  SelectMediaFileDialogComponent
} from './editor/dialogs/select-media-file-dialog/select-media-file-dialog.component';
import {EditPanoramaDialogComponent} from './editor/dialogs/edit-panorama-dialog/edit-panorama-dialog.component';
import {EditPuzzleDialogComponent} from './editor/dialogs/edit-puzzle-dialog/edit-puzzle-dialog.component';
import {AuthComponent} from './editor/auth-component/auth.component';
import {GamePlayerModule} from "./player-game/game-player/game-player.module";

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
    SaveMediaFileDialogComponent,
    SelectMediaFileDialogComponent,
    ItemGameComponent,
    BaseEditSceneDialogComponent,
    EditPanoramaDialogComponent,
    EditPuzzleDialogComponent,
    AuthComponent,
  ],
  imports: [
    FormsModule,
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
    RunGameModule,
    GamePlayerModule
  ],
  providers: [
   // {provide: AUTH_SETTINGS, useValue: {appVerificationDisabledForTesting: true}},
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
