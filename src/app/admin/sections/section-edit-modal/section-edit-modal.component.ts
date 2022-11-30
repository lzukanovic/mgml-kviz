import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmModalComponent, ModalConfig} from "../../../shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-section-edit-modal',
  templateUrl: './section-edit-modal.component.html',
  styleUrls: ['./section-edit-modal.component.scss']
})
export class SectionEditModalComponent implements OnInit {
  @Input() sectionId: number | null = null;

  @ViewChild('modal') private modalContent!: TemplateRef<SectionEditModalComponent>;
  private modalRef!: NgbModalRef;

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  deleteModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati izbrano sekcijo?',
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
    title: new FormControl('', Validators.required),
    description: new FormControl('')
  })

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent)
      this.modalRef.result.then(resolve, resolve)
    });

    // TODO: load section data
  }

  async delete(): Promise<void> {
    if (await this.deleteModal.open()) {
      // TODO: delete section
      this.form.reset();
      this.modalRef.close();
    }
  }

  async dismiss(): Promise<void> {
    if (!this.form.dirty || this.form.dirty && await this.unsavedChangesModal.open()) {
      this.form.reset();
      this.modalRef.dismiss();
    }
  }

  async save(): Promise<void> {
    // TODO: save section data OR create new section
    this.form.reset();
    this.modalRef.close();
  }
}
