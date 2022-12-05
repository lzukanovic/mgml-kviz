import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnswersType, Question, QuestionType} from "../../shared/interfaces";
import {ActivatedRoute, Router} from "@angular/router";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {AnswerEditModalComponent} from "./answer-edit-modal/answer-edit-modal.component";
import {ConfirmModalComponent, ModalConfig} from "../../shared/confirm-modal/confirm-modal.component";
import {QuestionService} from "../../services/question.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('answerEditModal') answerEditModal!: AnswerEditModalComponent;
  selectedEditAnswerId: number | null = null;

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  deleteModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati vprašanje? Vse slike in dodani odgovori vezani na vprašanje bodo tudi izbrisani.',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi'
  };

  // get from DB
  question!: Question;

  // get from URL
  questionId!: number;
  sectionId!: number;

  // TODO: finish validation for answers
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    type: new FormControl('singleChoice' as QuestionType, Validators.required),
    content: new FormControl('text' as AnswersType, Validators.required),
    possibleAnswers: new FormArray([])
  });

  get possibleAnswersForm(): FormArray {
    return this.form.get('possibleAnswers') as FormArray;
  }
  get possibleAnswersSorted(): FormGroup[] {
    return this.possibleAnswersForm.controls
      .sort((a, b) =>
        a.get("order")?.value - b.get("order")?.value
      ) as FormGroup[];
  }
  getAnswerParamForm(i: number, fc: string): FormControl {
    return this.possibleAnswersForm.at(i).get(fc) as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router,
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
    this.selectedEditAnswerId = this.possibleAnswersForm.at(index).get("id")?.value;
    const res = await this.answerEditModal.open();
    // TODO: refresh answer changes?
    this.selectedEditAnswerId = null;
  }

  async addAnswer() {
    const res = await this.answerEditModal.open();
    // TODO: refresh answer changes?
    // const fg = new FormGroup({
    //   id: new FormControl(null),
    //   text: new FormControl(''),
    //   image: new FormControl(''),
    //   selected: new FormControl(false),
    //   order: new FormControl(this.possibleAnswersForm.length)
    // });
    // this.possibleAnswersForm.push(fg);
  }

  removeAnswerById(id: number | null) {
    if (id === null) return;
    const index = this.possibleAnswersForm.controls.findIndex(a => a.get("id")?.value === id)
    this.removeAnswer(index);
  }
  removeAnswer(index: number) {
    this.possibleAnswersForm.removeAt(index);
    this.updateOrder();
  }

  updateOrder() {
    for (const [i, answer] of Object.entries(this.possibleAnswersForm.controls)) {
      answer.get('order')?.setValue(i);
    }
  }

  /*
  * Question operations
  */

  async loadQuestion() {
    if (!this.sectionId || !this.questionId) return;

    this.question = await lastValueFrom(this.questionService.getQuestion(this.sectionId, this.questionId));
    this.form.patchValue(this.question);
    // TODO: fill answers correctly
    // for (const answer of this.question.possibleAnswers) {
    //   const fg = new FormGroup({
    //     id: new FormControl(answer.id),
    //     text: new FormControl(answer.text),
    //     image: new FormControl(answer.image),
    //     selected: new FormControl(answer.selected),
    //     order: new FormControl(answer.order)
    //   });
    //   this.possibleAnswersForm.push(fg);
    // }
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

    if (this.questionId) {
      const res = await lastValueFrom(this.questionService.updateQuestion(this.sectionId, data))
      if (!res) {
        // TODO: error something went wrong with updating
      }
    } else {
      const res = await lastValueFrom(this.questionService.createQuestion(this.sectionId, data))
      if (!res) {
        // TODO: error something went wrong with creating
      }
      this.router.navigate(['/console', 'section', this.sectionId, 'question', res.id]);
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
