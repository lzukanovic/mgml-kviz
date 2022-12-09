import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {lastValueFrom, Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {Question} from "../../../shared/interfaces";
import {SafeUrl} from "@angular/platform-browser";
import {QuestionService} from "../../../services/question.service";
import getBreakpoint from "../../../shared/breakpoint.util";
import {Location} from "@angular/common";


@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  question!: Question;
  id!: number;
  url: string = "";
  qrCodeDownloadLink: SafeUrl = "";
  deviceSize: number = getBreakpoint(window.innerWidth, true) as number;

  get qrSize(): number {
    return this.scale(this.deviceSize, 1, 6, 200, 420);
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private questionService: QuestionService,
  ) { }

  ngOnInit(): void {
    // listen for question ID changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = parseInt(params.get('questionId') ?? '');
        this.url = environment.baseUrl + 'public/question/' + this.id;
        this.loadQuestion();
      });
  }

  async loadQuestion() {
    if (!this.id) return;

    // sectionId is not used in data fetch, but is included in API url for consistency
    this.question = await lastValueFrom(this.questionService.getQuestion(-1, this.id));
  }

  scale(num: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  goBack() {
    this.location.back();
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.deviceSize = getBreakpoint(event.target.innerWidth, true) as number;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
