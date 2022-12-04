import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    QuizComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class PublicModule { }
