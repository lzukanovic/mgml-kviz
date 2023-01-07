import {Component, OnDestroy, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import {interval, lastValueFrom, Subject, takeUntil} from "rxjs";
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

  optionPie: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      align: "left",
      padding: 0,
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
  optionBar: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Število odgovorov'
      }
    ],
    series: [
      {
        name: 'Število odgovorov',
        type: 'bar',
        barWidth: '60%',
      }
    ]
  };
  mergeOptionPie: any;
  mergeOptionBar: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private questionService: QuestionService,
    private answerService: AnswerService,
  ) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.loadQuestion();
      });

    // auto refresh
    interval(60000).pipe(takeUntil(this.destroy$)).subscribe(() => this.loadQuestion());
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

    this.mergeOptionPie = {series: [{ data }]}
    this.mergeOptionBar = {xAxis: [{data: this.answers.map(a => a.text || a.imageName)}], series: [{ data: this.answers.map(a => a.count)}]}
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
