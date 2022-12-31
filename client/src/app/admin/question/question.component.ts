import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import { v4 as uuidv4 } from 'uuid';
import {ComponentCanDeactivate} from "../../services/pending-changes.guard";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  private destroy$ = new Subject<void>();
  imagesMap = new Map();
  loadingAnswers = true;
  uploading = false;

  @ViewChild('answerEditModal') answerEditModal!: AnswerEditModalComponent;

  @ViewChild('deleteQuestionModal') deleteQuestionModal!: ConfirmModalComponent;
  deleteQuestionModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati vprašanje? Vse slike in dodani odgovori vezani na vprašanje bodo tudi izbrisani.',
    dismissButtonLabel: 'Prekliči',
    closeButtonLabel: 'Potrdi'
  };

  @ViewChild('deleteAnswerModal') deleteAnswerModal!: ConfirmModalComponent;
  deleteAnswerModalConfig: ModalConfig = {
    modalTitle: 'Izbriši',
    modalBody: 'Ali ste prepričani, da želite izbrisati odgovor? Vsa dosedaj zbrana statistika za odgovor bo tudi izbrisana.',
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
    this.showImagePreviews();
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
      this.showImagePreviews();
    }
  }

  showImagePreviews() {
    this.imagesMap.clear();
    for (const answer of this.answersForm.getRawValue()) {
      if (!answer.image) continue;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagesMap.set(answer.id, reader.result as string);
      }
      reader.readAsDataURL(answer.image);
    }
  }

  async removeAnswer(index: number) {
    if (await this.deleteAnswerModal.open()) {
      this.answersForm.removeAt(index);
      this.answersForm.markAsDirty();
      this.updateOrder();
    }
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
    this.loadingAnswers = true;
    this.answersForm.clear();
    this.answers = await lastValueFrom(this.answerService.getAnswers(this.sectionId, this.questionId));
    this.loadingAnswers = false;

    this.form.patchValue(this.question);
    for (const answer of this.answers) {
      let file = null;
      if (answer.imageType && answer.imageData) {
        file = this.answerService.bufferToFile(answer.imageName, answer.imageType, answer.imageData?.data)
      }

      const fg = new FormGroup({
        id: new FormControl(answer.id),
        text: new FormControl(answer.text),
        image: new FormControl(file),
        order: new FormControl(answer.order)
      });
      this.answersForm.push(fg);
    }

    this.showImagePreviews();
  }

  /*
  * Question operations
  */

  async loadQuestion() {
    if (!this.sectionId || !this.questionId) {
      this.loadingAnswers = false;
      return;
    }

    this.question = await lastValueFrom(this.questionService.getQuestion(this.sectionId, this.questionId));
    await this.loadAnswers();
  }

  async delete() {
    if (this.sectionId && this.questionId && await this.deleteQuestionModal.open()) {
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
    this.uploading = true;
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
      const formData: any = new FormData();
      const answersData = this.answersForm.getRawValue();

      for (const answer of answersData) {
        // for new answers create temporary id to which images can be matched
        if (isNaN(parseInt(answer.id))) {
          answer.id = uuidv4();
        }
        if (!answer.image) continue;
        formData.append('image'+answer.id, answer.image as File);
      }
      formData.append('answers', JSON.stringify(answersData));

      const res = await lastValueFrom(this.answerService.saveAnswers(
        this.sectionId,
        this.questionId || questionResponse.id,
        formData
      ))
      if (!res) {
        // TODO: error something went wrong with answers save
      }
    }
    this.uploading = false;

    // navigate to question page if new question
    if (!this.questionId && questionResponse) {
      this.router.navigate(['/console', 'section', this.sectionId, 'question', questionResponse.id]);
    }
    this.form.markAsPristine();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    if (!this.form) return true;
    return !this.form.dirty;
  }

  goBack() {
    this.router.navigate(['/console', 'section', this.sectionId]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
