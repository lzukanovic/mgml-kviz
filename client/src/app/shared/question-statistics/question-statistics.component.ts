import {Component, OnDestroy, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Answer, Question} from "../interfaces";
import {QuestionService} from "../../services/question.service";
import {AnswerService} from "../../services/answer.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-question-statistics',
  templateUrl: './question-statistics.component.html',
  styleUrls: ['./question-statistics.component.scss']
})
export class QuestionStatisticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  question!: Question;
  answers: Answer[] = [];
  id!: number;

  option: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      align: "auto"
    },
    series: [
      {
        type: 'pie',
        radius: '80%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  mergeOption: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private questionService: QuestionService,
    private answerService: AnswerService,
  ) { }

  // TODO: periodic refresh of answer data!!!

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
    this.question = await lastValueFrom(this.questionService.getQuestion(-1, this.id));
    this.answers = await lastValueFrom(this.answerService.getAnswers(-1, this.id));

    // load data into charts
    const data = [];
    for (const answer of this.answers) {
      data.push({
        value: answer.count,
        name: answer.text || answer.imageName
      })
    }

    this.mergeOption = {series: [{ data }]}
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
