import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Answer, Question} from "../../shared/interfaces";
import {QuestionService} from "../../services/question.service";
import {AnswerService} from "../../services/answer.service";
import {CelebrateService} from "../../services/celebrate.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form = new FormGroup({
    multipleChoiceAnswers: new FormArray([]),
    singleChoiceAnswer: new FormControl()
  });

  get multipleChoiceAnswersForm(): FormArray {
    return this.form.get('multipleChoiceAnswers') as FormArray;
  }
  getMultipleChoiceAnswerSelect(index: number): FormControl {
    return this.multipleChoiceAnswersForm.at(index).get('selected') as FormControl;
  }
  get singleChoiceAnswerForm(): FormControl {
    return this.form.get('singleChoiceAnswer') as FormControl;
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
    public celebrateService: CelebrateService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.hasAnswered = this.checkIfQuestionAnswered();
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
      this.multipleChoiceAnswersForm.push(fg);
    }

    this.setupForm();
  }

  setupForm() {
    if (this.hasAnswered) {
      this.form.disable();
    }
    if (this.question.type === "singleChoice") {
      this.singleChoiceAnswerForm.setValidators(Validators.required);
    }
    if (this.question.type === "multipleChoice") {
      this.multipleChoiceAnswersForm.setValidators(selectedAnswerValidator);
    }
    this.cdRef.detectChanges();
  }

  async submit() {
    if (this.form.invalid) return;

    let ids: number[] = [];
    if (this.question.type === "singleChoice") {
      ids.push(this.singleChoiceAnswerForm.value)
    }
    if (this.question.type === "multipleChoice") {
      ids = this.multipleChoiceAnswersForm.value.filter((a: any) => a.selected).map((a: any) => a.id)
    }
    const res = await lastValueFrom(this.answerService.incrementAnswers(-1, this.id, ids))
    if (!res) {
      // TODO: error something went wrong with updating
    }

    // mark question as answered on client device
    this.setQuestionAsAnswered();

    // update UI elements
    this.hasAnswered = true;
    this.form.disable();

    // animation
    this.celebrateService.startCelebration();
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
