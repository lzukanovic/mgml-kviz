import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnswersType, Question, QuestionType} from "../../shared/interfaces";
import {ActivatedRoute} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {AnswerEditModalComponent} from "./answer-edit-modal/answer-edit-modal.component";
import {ConfirmModalComponent, ModalConfig} from "../../shared/confirm-modal/confirm-modal.component";

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

  question!: Question;
  id!: number;

  // TODO: finish validation
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
    private location: Location,
    private route: ActivatedRoute
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
    this.form.patchValue(this.question);
    for (const answer of this.question.possibleAnswers) {
      const fg = new FormGroup({
        id: new FormControl(answer.id),
        text: new FormControl(answer.text),
        image: new FormControl(answer.image),
        selected: new FormControl(answer.selected),
        order: new FormControl(answer.order)
      });
      this.possibleAnswersForm.push(fg);
    }
  }

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

  async delete() {
    if (await this.deleteModal.open()) {
      // TODO: delete question and related entities
      this.goBack();
    }
  }

  async save() {}

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
