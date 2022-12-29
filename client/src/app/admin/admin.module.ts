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
import { QuestionComponent } from './question/question.component';
import { AnswerEditModalComponent } from './question/answer-edit-modal/answer-edit-modal.component';
import { QrCodeComponent } from './question/qr-code/qr-code.component';
import {QRCodeModule} from "angularx-qrcode";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    TopBarComponent,
    SectionsComponent,
    QuestionsListComponent,
    SectionEditModalComponent,
    NoSectionSelectedComponent,
    ConsoleComponent,
    QuestionComponent,
    AnswerEditModalComponent,
    QrCodeComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        QRCodeModule,
        NgbTooltipModule,
    ]
})
export class AdminModule { }
