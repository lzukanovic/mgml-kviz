import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Question, QuestionType} from "../../shared/interfaces";

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

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.loadQuestion();
      });
  }

  // TODO: get data from DB
  async loadQuestion() {
    this.question = {
      id: this.id,
      sectionId: 1,
      title: 'Kaj vam je bilo najbolj vsec na razstavi 1?',
      description: 'Dodatno pomožno besedilo za razumevanje vprašanja. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      type: "singleChoice",
      possibleAnswers: [
        {id: 0, text: 'metulji', selected: false, order: 0},
        {id: 1, text: 'clovesko telo', selected: false, order: 1},
        {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2}
      ]
    };

    for (const answer of this.question.possibleAnswers) {
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
