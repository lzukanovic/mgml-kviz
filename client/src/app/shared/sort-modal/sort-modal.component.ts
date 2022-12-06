import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import getBreakpoint from "../breakpoint.util";

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: []
})
export class SortModalComponent {
  @ViewChild('modal') private modalContent!: TemplateRef<SortModalComponent>;
  private modalRef!: NgbModalRef;

  form = new FormGroup({
    by: new FormControl('alphabetically' as SortBy),
    direction: new FormControl('ASC' as SortDirection)
  })

  constructor(private modalService: NgbModal) { }

  open(predefinedSort?: Sort): Promise<Sort> {
    if (predefinedSort) {
      this.form.patchValue(predefinedSort);
    }

    return new Promise<Sort>(resolve => {
      const smallerDevice = getBreakpoint(window.innerWidth, true) < 2;
      this.modalRef = this.modalService.open(this.modalContent, { centered: smallerDevice });
      this.modalRef.result.then(resolve, resolve)
    });
  }

  async close(): Promise<void> {
    this.modalRef.close(this.form.getRawValue());
  }

  async dismiss(): Promise<void> {
    this.modalRef.dismiss(null);
  }
}

export interface Sort {
  by: SortBy;
  direction: SortDirection;
}

export type SortBy = 'alphabetically' | 'createdAt' | 'updatedAt';
export type SortDirection = 'ASC' | 'DESC';
