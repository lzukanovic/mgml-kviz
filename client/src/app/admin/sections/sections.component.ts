import {Component, OnInit, ViewChild} from '@angular/core';
import {SectionEditModalComponent} from "./section-edit-modal/section-edit-modal.component";
import {Section} from "../../shared/interfaces";
import {SectionService} from "../../services/section.service";
import {lastValueFrom} from "rxjs";
import {Sort, SortModalComponent} from "../../shared/sort-modal/sort-modal.component";

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {
  @ViewChild('editModal') sectionEditModal!: SectionEditModalComponent;
  sections: Section[] = [];

  @ViewChild('sortModal') sortModal!: SortModalComponent;
  // default sort parameters
  sort: Sort = {
    by: "updatedAt",
    direction: "DESC"
  }

  constructor(private sectionService: SectionService) { }

  ngOnInit(): void {
    this.loadSections();
  }

  async loadSections() {
    this.sections = await lastValueFrom(this.sectionService.getSections(this.getSortParams()));
  }

  getSortParams(): string[] {
    let sortBy = this.sort.by.toString();
    if (sortBy === "alphabetically") {
      sortBy = 'title';
    }
    return [sortBy, this.sort.direction]
  }

  async openSortModal() {
    this.sort = await this.sortModal.open(this.sort);
    // reload sections after changes
    this.loadSections();
  }

  async openSectionModal(id: number | null, event: any) {
    event.stopPropagation();
    await this.sectionEditModal.open(id);

    // reload sections after changes
    this.loadSections();
  }
}
