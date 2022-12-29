import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import {PendingChangesService} from "./pending-changes.service";

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private pendingChangesService: PendingChangesService) {
  }

  async canDeactivate(component: ComponentCanDeactivate): Promise<boolean> {
    if (!component || component.canDeactivate()) {
      return true;
    } else {
      // open modal and get user decision
      return await this.pendingChangesService.openConfirmModal();
    }
  }
}

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
