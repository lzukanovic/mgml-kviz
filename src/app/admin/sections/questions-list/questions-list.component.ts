import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Question} from "../../../shared/interfaces";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSection: number | null = null;
  questionsDisplay: Question[] = [];
  // TODO: remove
  questions: Question[] = [
    {
      id: 1,
      sectionId: 1,
      title: 'Kaj vam je bilo najbolj vsec na razstavi 1?',
      description: 'Dodatno pomožno besedilo za razumevanje vprašanja. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      type: "singleChoice",
      possibleAnswers: [
        {id: 0, text: 'metulji', selected: false, order: 0},
        {id: 1, text: 'clovesko telo', selected: false, order: 1},
        {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2}
      ]
    },
    {
      id: 2,
      sectionId: 1,
      title: 'Kaj ste si najbolj zapomnili o razstavi 1?',
      type: "multipleChoice",
      possibleAnswers: [
        {id: 0, text: 'metulji', selected: false, order: 0},
        {id: 1, text: 'clovesko telo', selected: false, order: 1},
        {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2},
        {id: 3, text: 'geografija pokrajine', selected: false, order: 3}
      ]
    },
    {
      id: 3,
      sectionId: 2,
      title: 'Kaj ste si najbolj zapomnili o razstavi 2?',
      type: "multipleChoice",
      possibleAnswers: [
        {id: 0, text: 'metulji', selected: false, order: 0},
        {id: 1, text: 'clovesko telo', selected: false, order: 1},
        {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2},
        {id: 3, text: 'geografija pokrajine', selected: false, order: 3}
      ]
    },
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
