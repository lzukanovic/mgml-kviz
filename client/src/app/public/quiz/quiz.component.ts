import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Answer, Question} from "../../shared/interfaces";
import {QuestionService} from "../../services/question.service";
import {AnswerService} from "../../services/answer.service";

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
  get answersForm(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  getAnswerSelect(index: number): FormControl {
    return this.answersForm.at(index).get('selected') as FormControl;
  }

  question!: Question;
  answers: Answer[] = [];
  id!: number;
  hasAnswered = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
  ) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.hasAnswered = this.checkIfQuestionAnswered()
        this.loadQuestion();
      });
  }

  async loadQuestion() {
    if (!this.id) return;

    // sectionId is not used in data fetch, but is included in API url for consistency
    this.question = await lastValueFrom(this.questionService.getQuestion(-1, this.id));
    this.answers = await lastValueFrom(this.answerService.getAnswers(-1, this.id));

    for (const answer of this.answers) {
      const fg = new FormGroup({
        id: new FormControl(answer.id),
        text: new FormControl(answer.text),
        image: new FormControl(answer.image),
        order: new FormControl(answer.order),
        selected: new FormControl(false),
      });
      if (this.hasAnswered) {
        fg.disable();
      }
      this.answersForm.push(fg);
    }
  }

  async submit() {
    if (this.form.invalid) return;

    const ids: number[] = this.answersForm.getRawValue().filter(a => a.selected).map(a => a.id);
    const res = await lastValueFrom(this.answerService.incrementAnswers(-1, this.id, ids))
    if (!res) {
      // TODO: error something went wrong with updating
    }

    // mark question as answered on client device
    this.setQuestionAsAnswered();

    // navigate to statistics page
    this.router.navigate(['statistics'], {relativeTo: this.route});
  }

  checkIfQuestionAnswered(): boolean {
    if (!this.id) return false;

    const answered: number[] = JSON.parse(localStorage.getItem('answered') ?? '[]');
    return answered.includes(this.id);
  }

  setQuestionAsAnswered() {
    if (!this.id) return;

    const answered: number[] = JSON.parse(localStorage.getItem('answered') ?? '[]');
    if (answered.includes(this.id)) return;

    answered.push(this.id);
    localStorage.setItem('answered', JSON.stringify(answered));
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
