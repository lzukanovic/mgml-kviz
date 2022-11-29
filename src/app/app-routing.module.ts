import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConsoleComponent} from "./admin/console/console.component";

const routes: Routes = [
  { path: 'console', component: ConsoleComponent },
  { path: 'console/:id', component: ConsoleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
