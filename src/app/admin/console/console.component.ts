import {Component, OnInit, ViewChild} from '@angular/core';
import {SectionEditModalComponent} from "./section-edit-modal/section-edit-modal.component";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  @ViewChild('editModal') sectionEditModal!: SectionEditModalComponent;
  selectedSectionForEdit: number | null = null;

  sections: Section[] = [
    { id: 1, title: 'Section title placeholder 1', description: 'Section description placeholder 1, help text about section meaning.' },
    { id: 2, title: 'Section title placeholder 2', description: 'Section description placeholder 2, help text about section meaning.' },
    { id: 3, title: 'Section title placeholder 3', description: 'Section description placeholder 3, help text about section meaning.' },
    { id: 4, title: 'Section title placeholder 4', description: 'Section description placeholder 4, help text about section meaning.' },
    { id: 5, title: 'Section title placeholder 5', description: 'Section description placeholder 5, help text about section meaning.' },
    { id: 6, title: 'Section title placeholder 6', description: 'Section description placeholder 6, help text about section meaning.' },
    { id: 7, title: 'Section title placeholder 7', description: 'Section description placeholder 7, help text about section meaning.' },
    { id: 8, title: 'Section title placeholder 8', description: 'Section description placeholder 8, help text about section meaning.' },
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: load sections
  }

  async openSectionModal(id: number | null, event: any) {
    this.selectedSectionForEdit = id;
    event.stopPropagation();
    const res = await this.sectionEditModal.open();

    // TODO: refresh sections data
    this.selectedSectionForEdit = null;
  }
}

interface Section {
  id: number;
  title: string;
  description?: string;
}
