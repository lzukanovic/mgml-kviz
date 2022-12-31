import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent, ModalConfig} from "../../../shared/confirm-modal/confirm-modal.component";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
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
  preview: string | null = null;

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
    modalBody: 'Ali ste prepričani, da želite nadaljevati? Vse neshranjene spremembe bodo izgubljene.',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi',
    closeButtonStyle: 'btn-primary'
  };

  form: FormGroup = new FormGroup({
    text: new FormControl(''),
    image: new FormControl(null),
  }, { validators: atLeastOneValidator })

  constructor(
    private modalService: NgbModal,
    private answerService: AnswerService,
  ) { }

  ngOnInit(): void {
  }

  // Image Preview
  uploadFile(event: any) {
    const files = (event?.target as HTMLInputElement)?.files
    if (!files || !files.length) return;

    // Set form value
    const file = files[0];
    if (!file) return;

    this.setImage(file, true);

    // Clear the input
    event.target.value = null;
  }

  setImage(file: File | Blob, isDirty = false) {
    this.form.patchValue({
      image: file
    });

    if (isDirty) {
      this.form.markAsDirty();
    } else {
      this.form.markAsPristine();
    }

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  resetImage() {
    this.form.patchValue({
      image: null
    });
    this.form.markAsDirty();
    this.preview = null;
  }

  open(questionId: number | null, answerId: number | null): Promise<AnswerEdit> {
    return new Promise<AnswerEdit>(resolve => {
      const smallerDevice = getBreakpoint(window.innerWidth, true) < 2;
      this.modalRef = this.modalService.open(this.modalContent, { centered: smallerDevice, backdrop: 'static' });
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

    if (this.answer.imageType && this.answer.imageData) {
      // TODO: remove
      // const b64encoded = btoa(String.fromCharCode.apply(null, Array.from(this.answer.imageData.data)));
      // this.preview = 'data:' + this.answer.imageType + ';base64,' + b64encoded;
      const file = this.answerService.bufferToFile(this.answer.imageName, this.answer.imageType, this.answer.imageData.data);
      this.setImage(file);
    }
  }

  async delete(): Promise<void> {
    if (this.questionId && this.answerId && await this.deleteModal.open()) {
      this.form.reset();
      this.preview = null;
      this.modalRef.close({...this.answer, action: "DELETE"} as AnswerEdit);
    }
  }

  async dismiss(): Promise<void> {
    if (!this.form.dirty || (this.form.dirty && await this.unsavedChangesModal.open())) {
      this.form.reset();
      this.preview = null;
      this.modalRef.dismiss(null);
    }
  }

  async save(): Promise<void> {
    const data: Answer = {
      id: this.answerId, // number or null
      questionId: this.questionId,
      ...this.form.getRawValue()
    }

    this.form.reset();
    this.preview = null;
    this.modalRef.close({...data, action: this.answerId ? "UPDATE" : "CREATE"} as AnswerEdit);
  }
}

export const atLeastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const text = control.get('text');
  const image = control.get('image');
  return ((text && text.value?.length) || (image && image.value)) ? null : { bothMissing: true };
};
