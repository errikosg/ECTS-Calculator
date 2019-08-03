import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule, MatListModule, MatInputModule,MatSortModule,
  MatCardModule, MatProgressSpinnerModule, MatIconModule, MatPaginatorModule,
  MatGridListModule, MatSnackBarModule, MatToolbarModule, MatTableModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
  ],
  exports: [
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
  ]
})
export class SharedModule { }
