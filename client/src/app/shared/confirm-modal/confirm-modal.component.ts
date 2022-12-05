import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: []
})
export class ConfirmModalComponent {
  @Input() modalConfig!: ModalConfig;

  @ViewChild('modal') private modalContent!: TemplateRef<ConfirmModalComponent>;
  private modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent)
      this.modalRef.result.then(resolve, resolve)
    });
  }

  async close(): Promise<void> {
    this.modalRef.close(true);
  }

  async dismiss(): Promise<void> {
    this.modalRef.dismiss(false);
  }
}

export interface ModalConfig {
  modalTitle: string;
  modalBody: string;
  dismissButtonLabel?: string;
  closeButtonLabel?: string;
  closeButtonStyle?: string;
}
