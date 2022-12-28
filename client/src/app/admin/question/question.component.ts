import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {Answer, Question, QuestionType} from "../../shared/interfaces";
import {ActivatedRoute, Router} from "@angular/router";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {AnswerEditModalComponent} from "./answer-edit-modal/answer-edit-modal.component";
import {ConfirmModalComponent, ModalConfig} from "../../shared/confirm-modal/confirm-modal.component";
import {QuestionService} from "../../services/question.service";
import {AnswerService} from "../../services/answer.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  // TODO: add navigation listener and show modal for unsaved changes!
  // TODO: add form validation in template!
  private destroy$ = new Subject<void>();

  @ViewChild('answerEditModal') answerEditModal!: AnswerEditModalComponent;

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  deleteModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati vprašanje? Vse slike in dodani odgovori vezani na vprašanje bodo tudi izbrisani.',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi'
  };

  // get from DB
  question!: Question;
  answers: Answer[] = [];

  // get from URL
  questionId!: number;
  sectionId!: number;

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    type: new FormControl('singleChoice' as QuestionType, Validators.required),
    answers: new FormArray([], Validators.required)
  });

  get answersForm(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  get answersSorted(): FormGroup[] {
    return this.answersForm.controls
      .sort((a, b) =>
        a.get("order")?.value - b.get("order")?.value
      ) as FormGroup[];
  }
  getAnswerParamForm(i: number, fc: string): FormControl {
    return this.answersForm.at(i).get(fc) as FormControl;
  }

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
        this.sectionId = parseInt(params.get('sectionId') ?? '');
        this.questionId = parseInt(params.get('questionId') ?? '');
        this.loadQuestion();
      });
  }

  /*
  * Question's answer operations
  */

  async editAnswer(index: number) {
    const answerId = this.answersForm.at(index).get("id")?.value;
    const res = await this.answerEditModal.open(this.questionId, answerId);

    // check if any changes
    if (!res) return;

    // check action
    if (res.action === "UPDATE") {
      this.answersForm.at(index).patchValue(res);
    } else if (res.action === "DELETE") {
      this.answersForm.removeAt(index);
    }
    this.answersForm.markAsDirty();
  }

  async addAnswer() {
    const res = await this.answerEditModal.open(this.questionId, null);

    // check action
    if (res?.action === "CREATE") {
      const maxOrder = Math.max(...this.answersForm.getRawValue().map(a => a.order), -1);
      const fg = new FormGroup({
        id: new FormControl(null),
        text: new FormControl(res.text),
        image: new FormControl(res.image),
        order: new FormControl(maxOrder + 1)
      });
      this.answersForm.push(fg);
      this.answersForm.markAsDirty();
    }
  }

  removeAnswer(index: number) {
    this.answersForm.removeAt(index);
    this.answersForm.markAsDirty();
    this.updateOrder();
  }

  updateOrder() {
    for (const [i, answer] of Object.entries(this.answersForm.controls)) {
      answer.get('order')?.setValue(i);
    }
  }

  findAnswerIndexById(id: number | null): number {
    if (id === null) return -1;
    return this.answersForm.controls.findIndex(a => a.get("id")?.value === id);
  }

  async loadAnswers() {
    this.answersForm.clear();
    this.answers = await lastValueFrom(this.answerService.getAnswers(this.sectionId, this.questionId));

    this.form.patchValue(this.question);
    for (const answer of this.answers) {
      const fg = new FormGroup({
        id: new FormControl(answer.id),
        text: new FormControl(answer.text),
        image: new FormControl(answer.image),
        order: new FormControl(answer.order)
      });
      this.answersForm.push(fg);
    }
  }

  /*
  * Question operations
  */

  async loadQuestion() {
    if (!this.sectionId || !this.questionId) return;

    this.question = await lastValueFrom(this.questionService.getQuestion(this.sectionId, this.questionId));
    await this.loadAnswers();
  }

  async delete() {
    if (this.sectionId && this.questionId && await this.deleteModal.open()) {
      const res = await lastValueFrom(this.questionService.deleteQuestion(this.sectionId, this.questionId))
      if (!res) {
        // TODO: error something went wrong with deleting
      }
      this.goBack();
    }
  }

  async save() {
    const data = {
      id: this.questionId, // number or null
      ...this.form.getRawValue()
    }
    let questionResponse!: Question;

    // save or create question
    if (this.questionId) {
      questionResponse = await lastValueFrom(this.questionService.updateQuestion(this.sectionId, data))
      if (!questionResponse) {
        // TODO: error something went wrong with updating
      }
    } else {
      questionResponse = await lastValueFrom(this.questionService.createQuestion(this.sectionId, data))
      if (!questionResponse) {
        // TODO: error something went wrong with creating
      }
    }

    // save, create or delete answers if question was saved successfully
    if (questionResponse) {
      const res = await lastValueFrom(this.answerService.saveAnswers(
        this.sectionId,
        this.questionId || questionResponse.id,
        this.answersForm.getRawValue()
      ))
      if (!res) {
        // TODO: error something went wrong with answers save
      }
    }

    // navigate to question page if new question
    if (!this.questionId && questionResponse) {
      this.router.navigate(['/console', 'section', this.sectionId, 'question', questionResponse.id]);
    }
    this.form.markAsPristine();
  }

  goBack() {
    this.router.navigate(['/console', 'section', this.sectionId]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
