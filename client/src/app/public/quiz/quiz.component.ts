import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Answer, Question, QuestionType} from "../../shared/interfaces";
import {QuestionService} from "../../services/question.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form = new FormGroup({
    answers: new FormArray([], {validators: selectedAnswerValidator})
  });
  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  getAnswerSelect(index: number): FormControl {
    return this.answers.at(index).get('selected') as FormControl;
  }

  question!: Question;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.loadQuestion();
      });
  }

  async loadQuestion() {
    if (!this.id) return;

    // sectionId is not used in data fetch, but is included in API url for consistency
    this.question = await lastValueFrom(this.questionService.getQuestion(0, this.id));

    // TODO: fill answers correctly
    // this.form.patchValue();
    const answers: Answer[] = [
      {id: 0, text: 'metulji', selected: false, order: 0},
      {id: 1, text: 'clovesko telo', selected: false, order: 1},
      {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2}
    ];

    for (const answer of answers) {
      const fg = new FormGroup({
        id: new FormControl(answer.id),
        text: new FormControl(answer.text),
        image: new FormControl(answer.image),
        selected: new FormControl(answer.selected),
        order: new FormControl(answer.order)
      });
      this.answers.push(fg);
    }
  }

  async submit() {
    // TODO: save answer
    this.router.navigate(['/statistics']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export const selectedAnswerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let selected = false;
  for (let answer of (control as FormArray).controls) {
    selected = selected || answer.get("selected")?.value;
  }

  return !selected ? { notSelected: true } : null;
};
