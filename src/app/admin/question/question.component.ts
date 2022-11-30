import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Question, QuestionType} from "../../shared/interfaces";
import {ActivatedRoute} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  question!: Question;
  id!: number;

  // TODO: finish validation
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    type: new FormControl('singleChoice' as QuestionType, Validators.required),
    possibleAnswers: new FormArray([])
  });

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
      possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek' ]
    };
    this.form.patchValue(this.question);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
