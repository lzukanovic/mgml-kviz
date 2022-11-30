import {Component, Input, OnInit, Output, TemplateRef, ViewChild, EventEmitter} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent, ModalConfig} from "../../../shared/confirm-modal/confirm-modal.component";
import {FormControl, FormGroup} from "@angular/forms";
import {AnswersType} from "../../../shared/interfaces";

@Component({
  selector: 'app-answer-edit-modal',
  templateUrl: './answer-edit-modal.component.html',
  styleUrls: ['./answer-edit-modal.component.scss']
})
export class AnswerEditModalComponent implements OnInit {
  @Input() answerId: number | null = null;
  @Input() answerType: AnswersType = "text";
  @Output() deleteEvent = new EventEmitter<boolean>();

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
    image: new FormControl(''),
  })

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent)
      this.modalRef.result.then(resolve, resolve)
    });

    // TODO: load answer data
  }

  async delete(): Promise<void> {
    if (await this.deleteModal.open()) {
      this.form.reset();
      this.modalRef.close();
      this.deleteEvent.emit(true);
    }
  }

  async dismiss(): Promise<void> {
    if (!this.form.dirty || (this.form.dirty && await this.unsavedChangesModal.open())) {
      this.form.reset();
      this.modalRef.dismiss();
    }
  }

  async save(): Promise<void> {
    // TODO: save answer data OR create new answer
    this.form.reset();
    this.modalRef.close();
  }
}
