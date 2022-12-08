import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SortModalComponent } from './sort-modal/sort-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import { QuestionStatisticsComponent } from './question-statistics/question-statistics.component';



@NgModule({
  declarations: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent
  ]
})
export class SharedModule { }
