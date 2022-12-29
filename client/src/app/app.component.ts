import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PendingChangesService} from "./services/pending-changes.service";
import {ConfirmModalComponent, ModalConfig} from "./shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('unsavedChangesModal') unsavedChangesModal!: ConfirmModalComponent;
  unsavedChangesModalConfig: ModalConfig = {
    modalTitle: 'Neshranjene spremembe',
    modalBody: 'Ali ste prepričani, da želite zapustiti stran? Vse neshranjene spremembe bodo izgubljene.',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi',
    closeButtonStyle: 'btn-primary'
  };

  constructor(private pendingChangesService: PendingChangesService) {
  }

  ngAfterViewInit() {
    this.pendingChangesService.init(this.unsavedChangesModal);
  }
}
