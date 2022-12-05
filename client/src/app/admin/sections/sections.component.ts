import {Component, OnInit, ViewChild} from '@angular/core';
import {SectionEditModalComponent} from "./section-edit-modal/section-edit-modal.component";
import {Section} from "../../shared/interfaces";
import {SectionService} from "../../services/section.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {
  @ViewChild('editModal') sectionEditModal!: SectionEditModalComponent;
  sections: Section[] = [];

  constructor(private sectionService: SectionService) { }

  ngOnInit(): void {
    this.loadSections();
  }

  async loadSections() {
    this.sections = await lastValueFrom(this.sectionService.getSections());
  }

  async openSectionModal(id: number | null, event: any) {
    event.stopPropagation();
    await this.sectionEditModal.open(id);

    this.loadSections();
  }
}
