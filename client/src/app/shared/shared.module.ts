import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SortModalComponent } from './sort-modal/sort-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import { QuestionStatisticsComponent } from './question-statistics/question-statistics.component';
import { CelebrateComponent } from './celebrate/celebrate.component';



@NgModule({
  declarations: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent,
    CelebrateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent,
    CelebrateComponent
  ]
})
export class SharedModule { }
