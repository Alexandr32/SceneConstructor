import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {EditorComponent} from './editor/editor.component';
import {SceneComponent} from './scene/scene.component';
import {ToCoordinatesPipe} from './pipe/toсoordinates.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EditorComponent,
    SceneComponent,
    ToCoordinatesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
