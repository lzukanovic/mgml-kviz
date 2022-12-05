import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SortModalComponent } from './sort-modal/sort-modal.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ConfirmModalComponent,
    SortModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ConfirmModalComponent,
    SortModalComponent,
  ]
})
export class SharedModule { }
