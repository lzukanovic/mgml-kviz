import { Component } from '@angular/core';

@Component({
  selector: 'app-no-section-selected',
  template: `
      <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center text-muted">
        <i class="bi bi-folder2-open fs-2"></i>
        <p class="text-center">Prosimo izberite eno sekcijo</p>
      </div>
  `,
  styles: [ `
    div {
      height: calc(100vh - 56px);
    }
  `]
})
export class NoSectionSelectedComponent {
  constructor() { }
}
