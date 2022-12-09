import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import { QuestionStatisticsWrapperComponent } from './question-statistics-wrapper/question-statistics-wrapper.component';



@NgModule({
  declarations: [
    QuizComponent,
    QuestionStatisticsWrapperComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        FormsModule
    ]
})
export class PublicModule { }
