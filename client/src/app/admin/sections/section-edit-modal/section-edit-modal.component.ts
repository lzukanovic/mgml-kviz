import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmModalComponent, ModalConfig} from "../../../shared/confirm-modal/confirm-modal.component";
import {Section} from "../../../shared/interfaces";
import {SectionService} from "../../../services/section.service";
import {lastValueFrom} from "rxjs";
import getBreakpoint from "../../../shared/breakpoint.util";

@Component({
  selector: 'app-section-edit-modal',
  templateUrl: './section-edit-modal.component.html',
  styleUrls: ['./section-edit-modal.component.scss']
})
export class SectionEditModalComponent implements OnInit {
  sectionId: number | null = null;
  section: Section | null = null;

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

  constructor(
    private modalService: NgbModal,
    private sectionService: SectionService,
  ) { }

  ngOnInit(): void {
  }

  open(sectionId: number | null): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const smallerDevice = getBreakpoint(window.innerWidth, true) < 2;
      this.modalRef = this.modalService.open(this.modalContent, { centered: smallerDevice });
      this.modalRef.result.then(resolve, resolve);

      this.sectionId = sectionId;
      this.loadSection();
    });
  }

  async loadSection() {
    if (!this.sectionId) return;
    this.section = await lastValueFrom(this.sectionService.getSection(this.sectionId));
    if (!this.section) return;
    this.form.patchValue(this.section);
  }

  async delete(): Promise<void> {
    if (this.sectionId && await this.deleteModal.open()) {
      const res = await lastValueFrom(this.sectionService.deleteSection(this.sectionId))
      if (!res) {
        // TODO: error something went wrong with deleting the section
      }
      this.form.reset();
      this.modalRef.close(true);
    }
  }

  async dismiss(): Promise<void> {
    if (!this.form.dirty || (this.form.dirty && await this.unsavedChangesModal.open())) {
      this.form.reset();
      this.modalRef.dismiss(false);
    }
  }

  async save(): Promise<void> {
    const data: Section = {
      id: this.sectionId, // number or null
      ...this.form.getRawValue()
    }

    if (this.sectionId) {
      const res = await lastValueFrom(this.sectionService.updateSection(data))
      if (!res) {
        // TODO: error something went wrong with updating the section
      }
    } else {
      const res = await lastValueFrom(this.sectionService.createSection(data))
      if (!res) {
        // TODO: error something went wrong with creating the section
      }
    }

    this.form.reset();
    this.modalRef.close(true);
  }
}
