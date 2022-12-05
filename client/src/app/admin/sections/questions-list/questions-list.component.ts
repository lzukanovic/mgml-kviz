import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Question} from "../../../shared/interfaces";
import {QuestionService} from "../../../services/question.service";
import {Sort, SortModalComponent} from "../../../shared/sort-modal/sort-modal.component";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('sortModal') sortModal!: SortModalComponent;
  sort: Sort = {
    by: "alphabetically",
    direction: "ASC"
  }

  selectedSectionId: number | null = null;
  questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
  ) { }

  ngOnInit(): void {
    // listen for section ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = parseInt(params.get('sectionId') ?? '');
        this.selectedSectionId = id ? +id : null;
        this.loadQuestions();
      });
  }

  /**
   * With selected section ID fetch section questions from server
   */
  async loadQuestions() {
    if (!this.selectedSectionId) return;
    this.questions = await lastValueFrom(this.questionService.getQuestions(this.selectedSectionId, this.getSortParams()));
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
    this.loadQuestions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
