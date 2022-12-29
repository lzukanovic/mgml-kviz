import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";

@Injectable({
  providedIn: 'root'
})
export class PendingChangesService {
  modalOpenRequest$ = new Subject<any>();

  init(confirmModal: ConfirmModalComponent) {
    this.modalOpenRequest$.pipe().subscribe(async (req: OpenModalRequest) => {
      const res = await confirmModal.open();
      req.resolve(res);
    });
  }

  async openConfirmModal(): Promise<boolean> {
    return await new Promise<boolean>((resolve) => {
      this.modalOpenRequest$.next({ resolve });
    });
  }
}

interface OpenModalRequest {
  resolve: (b: boolean) => void;
}
