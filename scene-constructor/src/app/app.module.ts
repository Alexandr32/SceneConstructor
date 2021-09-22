import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {SceneComponent} from './scene/scene.component';
import {ToCoordinatesPipe} from './pipe/toсoordinates.pipe';
import {SvgLineComponent} from './svg-line/svg-line.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {EditSceneDialogComponent} from './edit-scene-dialog/edit-scene-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {EditPlayerDialogComponent} from './edit-player-dialog/edit-player-dialog.component';
import {ImageCropperModule} from 'ngx-img-cropper';
import {EditImageComponent} from './edit-image-player/edit-image.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {MessageDialogComponent} from './core/message-dialog/message-dialog.component';
import {GameListComponent} from './game-list/game-list.component';
import {RunGameModule} from './run-game/run-game.module';
import {CoreModule} from './core/core.module';
import {HeaderComponent} from './core/header/header.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    SceneComponent,
    ToCoordinatesPipe,
    SvgLineComponent,
    EditSceneDialogComponent,
    EditPlayerDialogComponent,
    EditImageComponent,
    GameListComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RunGameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
