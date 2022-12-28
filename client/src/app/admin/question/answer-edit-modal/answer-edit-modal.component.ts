import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent, ModalConfig} from "../../../shared/confirm-modal/confirm-modal.component";
import {FormControl, FormGroup} from "@angular/forms";
import getBreakpoint from "../../../shared/breakpoint.util";
import {lastValueFrom} from "rxjs";
import {Answer, AnswerEdit} from 'src/app/shared/interfaces';
import {AnswerService} from "../../../services/answer.service";

@Component({
  selector: 'app-answer-edit-modal',
  templateUrl: './answer-edit-modal.component.html',
  styleUrls: ['./answer-edit-modal.component.scss']
})
export class AnswerEditModalComponent implements OnInit {
  questionId: number | null = null;
  answerId: number | null = null;
  answer: Answer | null = null;

  @ViewChild('modal') private modalContent!: TemplateRef<AnswerEditModalComponent>;
  private modalRef!: NgbModalRef;

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  deleteModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati izbrani odgovor?',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi'
  };

  @ViewChild('unsavedChangesModal') unsavedChangesModal!: ConfirmModalComponent;
  unsavedChangesModalConfig: ModalConfig = {
    modalTitle: 'Neshranjene spremembe',
    modalBody: 'Če nadaljujete boste izgubili vaše spremembe?',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi',
    closeButtonStyle: 'btn-primary'
  };

  form: FormGroup = new FormGroup({
    text: new FormControl(''),
    image: new FormControl(null),
  })

  constructor(
    private modalService: NgbModal,
    private answerService: AnswerService,
  ) { }

  ngOnInit(): void {
  }

  open(questionId: number | null, answerId: number | null): Promise<AnswerEdit> {
    return new Promise<AnswerEdit>(resolve => {
      const smallerDevice = getBreakpoint(window.innerWidth, true) < 2;
      this.modalRef = this.modalService.open(this.modalContent, { centered: smallerDevice });
      this.modalRef.result.then(resolve, resolve);

      this.questionId = questionId;
      this.answerId = answerId;
      this.loadAnswer();
    });
  }

  async loadAnswer() {
    if (!this.questionId || !this.answerId) return;
    this.answer = await lastValueFrom(this.answerService.getAnswer(-1, this.questionId, this.answerId));
    if (!this.answer) return;
    this.form.patchValue(this.answer);
  }

  async delete(): Promise<void> {
    if (this.questionId && this.answerId && await this.deleteModal.open()) {
      // TODO: remove
      // const res = await lastValueFrom(this.answerService.deleteAnswer(-1, this.questionId, this.answerId))
      // if (!res) {
      //   // TODO: error something went wrong with deleting the section
      // }
      this.form.reset();
      this.modalRef.close({...this.answer, action: "DELETE"} as AnswerEdit);
    }
  }

  async dismiss(): Promise<void> {
    if (!this.form.dirty || (this.form.dirty && await this.unsavedChangesModal.open())) {
      this.form.reset();
      this.modalRef.dismiss(null);
    }
  }

  async save(): Promise<void> {
    const data: Answer = {
      id: this.answerId, // number or null
      questionId: this.questionId,
      ...this.form.getRawValue()
    }

    // TODO: remove
    // if (this.answerId) {
    //   const res = await lastValueFrom(this.answerService.updateAnswer(-1, this.questionId, data))
    //   if (!res) {
    //     // TODO: error something went wrong with updating the section
    //   }
    // } else {
    //   const res = await lastValueFrom(this.answerService.createAnswer(-1, this.questionId, data))
    //   if (!res) {
    //     // TODO: error something went wrong with creating the section
    //   }
    // }

    this.form.reset();
    this.modalRef.close({...data, action: this.answerId ? "UPDATE" : "CREATE"} as AnswerEdit);
  }
}
