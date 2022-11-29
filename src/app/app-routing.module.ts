import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SectionsComponent} from "./admin/sections/sections.component";
import {QuestionsListComponent} from "./admin/sections/questions-list/questions-list.component";
import {NoSectionSelectedComponent} from "./admin/sections/no-section-selected/no-section-selected.component";
import {ConsoleComponent} from "./admin/console/console.component";

const routes: Routes = [
  {
    path: 'console',
    component: ConsoleComponent,
    children: [
      {
        path: 'section',
        component: SectionsComponent,
        children: [
          { path: '', component: NoSectionSelectedComponent },
          { path: ':sectionId', component: QuestionsListComponent }
        ]
      },
      // TODO: components
      // {
      //   path: 'question',
      //   children: [
      //     { path: ':questionId' },
      //     { path: ':questionId/code' },
      //     { path: ':questionId/statistics' },
      //   ]
      // }
    ]
  },
  { path: '**', redirectTo: 'console/section', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
