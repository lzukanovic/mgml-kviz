import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {Question} from "../../../shared/interfaces";
import {SafeUrl} from "@angular/platform-browser";


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


  constructor(private route: ActivatedRoute) { }

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

  // TODO: get data from DB
  async loadQuestion() {
    this.question = {
      id: this.id,
      sectionId: 1,
      title: 'Kaj vam je bilo najbolj vsec na razstavi 1?',
      description: 'Dodatno pomožno besedilo za razumevanje vprašanja. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      type: "singleChoice",
      content: "text",
      possibleAnswers: [
        {id: 0, text: 'metulji', selected: false, order: 0},
        {id: 1, text: 'clovesko telo', selected: false, order: 1},
        {id: 2, text: 'zdravstvni oddelek', selected: false, order: 2}
      ],
      createdAt: new Date()
    };
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
