import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSection: number | null = null;
  questionsDisplay: Question[] = [];
  questions: Question[] = [
    { id: 1, sectionId: 1, title: 'Kaj vam je bilo najbolj vsec na razstavi 1?', type: "singleChoice", possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek' ] },
    { id: 2, sectionId: 1, title: 'Kaj ste si najbolj zapomnili o razstavi 1?', type: "multipleChoice", possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek', 'geografija pokrajine' ] },
    { id: 3, sectionId: 2, title: 'Kaj ste si najbolj zapomnili o razstavi 2?', type: "multipleChoice", possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek', 'geografija pokrajine' ] },
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // listen for section ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = parseInt(params.get('sectionId') ?? '');
        this.selectedSection = id ? +id : null;
        this.loadQuestions();
      });
  }

  /**
   * With selected section ID fetch section questions from server
   * TODO: load questions for section
   */
  async loadQuestions() {
    if (!this.selectedSection) return;

    this.questionsDisplay = this.questions.filter(q => q.sectionId === this.selectedSection);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface Question {
  id: number;
  sectionId: number;
  title: string;
  description?: string;
  type: QuestionType;
  possibleAnswers: string[];
}

type QuestionType = 'singleChoice' | 'multipleChoice';
