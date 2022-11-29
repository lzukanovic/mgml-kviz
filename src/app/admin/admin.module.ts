import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SectionsComponent } from './sections/sections.component';
import {RouterModule} from "@angular/router";
import { QuestionsListComponent } from './sections/questions-list/questions-list.component';
import { SectionEditModalComponent } from './sections/section-edit-modal/section-edit-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { NoSectionSelectedComponent } from './sections/no-section-selected/no-section-selected.component';
import { ConsoleComponent } from './console/console.component';



@NgModule({
  declarations: [
    TopBarComponent,
    SectionsComponent,
    QuestionsListComponent,
    SectionEditModalComponent,
    NoSectionSelectedComponent,
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AdminModule { }
