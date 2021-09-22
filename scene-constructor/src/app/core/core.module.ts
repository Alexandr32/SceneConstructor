import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    HeaderComponent,
    MessageDialogComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
  ],
  exports: [
    HeaderComponent,
    MessageDialogComponent
  ]
})
export class CoreModule { }
