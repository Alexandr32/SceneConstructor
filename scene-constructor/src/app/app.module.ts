import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {EditorComponent} from './editor/editor.component';
import {SceneComponent} from './scene/scene.component';
import {ToCoordinatesPipe} from './pipe/toсoordinates.pipe';
import {SvgLineComponent} from './svg-line/svg-line.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {EditSceneDialogComponent} from './edit-scene-dialog/edit-scene-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import { EditPlayerDialogComponent } from './edit-player-dialog/edit-player-dialog.component';
import {ImageCropperModule} from 'ngx-img-cropper';
import { EditImageComponent } from './edit-image-player/edit-image.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EditorComponent,
    SceneComponent,
    ToCoordinatesPipe,
    SvgLineComponent,
    EditSceneDialogComponent,
    EditPlayerDialogComponent,
    EditImageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        ImageCropperModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
