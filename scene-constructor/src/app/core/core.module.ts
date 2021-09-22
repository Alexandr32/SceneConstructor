import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MessageDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    MessageDialogComponent
  ]
})
export class CoreModule { }
