import {Component, OnInit, ViewChild} from '@angular/core';
import {SectionEditModalComponent} from "./section-edit-modal/section-edit-modal.component";
import {Section} from "../../shared/interfaces";
import {SectionService} from "../../services/section.service";
import {lastValueFrom} from "rxjs";
import {Sort, SortModalComponent} from "../../shared/sort-modal/sort-modal.component";
import {Router} from "@angular/router";

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
  defaultSort: Sort = {
    by: "updatedAt",
    direction: "DESC"
  }
  sort: Sort = this.defaultSort;

  constructor(
    private sectionService: SectionService,
    private router: Router,
  ) { }

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
    if (!this.sort) {
      this.sort = this.defaultSort;
    }
    // reload sections after changes
    this.loadSections();
  }

  async openSectionModal(id: number | null, event: any) {
    event.stopPropagation();
    await this.sectionEditModal.open(id);

    // reload sections after changes
    await this.loadSections();

    // check if selected section was deleted
    if (id == null || isNaN(id)) return;

    const index = this.sections.findIndex(s => s.id == id);
    if (index >= 0) return;

    this.router.navigate(['/console', 'section'])
  }
}
