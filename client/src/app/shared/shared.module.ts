import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SortModalComponent } from './sort-modal/sort-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import { QuestionStatisticsComponent } from './question-statistics/question-statistics.component';
import { CelebrateComponent } from './celebrate/celebrate.component';
import {NgxEchartsModule} from "ngx-echarts";
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import {NgbToastModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent,
    CelebrateComponent,
    ToastsContainerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({echarts: () => import('echarts')}),
    NgbToastModule,
  ],
  exports: [
    ConfirmModalComponent,
    SortModalComponent,
    QuestionStatisticsComponent,
    CelebrateComponent,
    ToastsContainerComponent,
  ]
})
export class SharedModule { }
