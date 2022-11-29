import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConsoleComponent} from "./admin/console/console.component";
import {QuestionsComponent} from "./admin/questions/questions.component";
import {NoSectionSelectedComponent} from "./admin/console/no-section-selected/no-section-selected.component";

const routes: Routes = [
  {
    path: 'console',
    component: ConsoleComponent,
    children: [
      { path: '', component: NoSectionSelectedComponent },
      { path: ':id', component: QuestionsComponent }
    ]
  },
  { path: '**', redirectTo: 'console', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
