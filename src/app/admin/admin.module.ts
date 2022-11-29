import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ConsoleComponent } from './console/console.component';
import {RouterModule} from "@angular/router";
import { QuestionsComponent } from './questions/questions.component';
import { SectionEditModalComponent } from './console/section-edit-modal/section-edit-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { NoSectionSelectedComponent } from './console/no-section-selected/no-section-selected.component';



@NgModule({
  declarations: [
    TopBarComponent,
    ConsoleComponent,
    QuestionsComponent,
    SectionEditModalComponent,
    NoSectionSelectedComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AdminModule { }
