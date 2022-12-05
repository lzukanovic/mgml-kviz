import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SectionsComponent} from "./admin/sections/sections.component";
import {QuestionsListComponent} from "./admin/sections/questions-list/questions-list.component";
import {NoSectionSelectedComponent} from "./admin/sections/no-section-selected/no-section-selected.component";
import {ConsoleComponent} from "./admin/console/console.component";
import {QuestionComponent} from "./admin/question/question.component";
import {LoginComponent} from "./lock/login/login.component";
import {AuthGuard} from "./services/auth.guard";
import {QuizComponent} from "./public/quiz/quiz.component";
import {QrCodeComponent} from "./admin/question/qr-code/qr-code.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'console',
    component: ConsoleComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'section', pathMatch: 'full' },
      {
        path: 'section',
        component: SectionsComponent,
        children: [
          { path: '', component: NoSectionSelectedComponent },
          { path: ':sectionId', component: QuestionsListComponent }
        ]
      },
      {
        path: 'section/:sectionId/question',
        children: [
          { path: '', redirectTo: '/console/section', pathMatch: 'full' },
          { path: 'new', component: QuestionComponent },
          { path: ':questionId', component: QuestionComponent },
          { path: ':questionId/code', component: QrCodeComponent },
          // TODO  { path: 'statistics' },
        ]
      }
    ]
  },
  {
    path: 'public/question/:questionId',
    children: [
      { path: '', component: QuizComponent },
      // TODO  { path: 'statistics' },
    ]
  },
  { path: '**', redirectTo: 'console/section', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
