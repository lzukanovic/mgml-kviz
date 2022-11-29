import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  selectedSection: number | null = null;
  sections: Section[] = [
    { id: 1, title: 'Section title placeholder 1', description: 'Section description placeholder 1, help text about section meaning.' },
    { id: 2, title: 'Section title placeholder 2', description: 'Section description placeholder 2, help text about section meaning.' },
    { id: 3, title: 'Section title placeholder 3', description: 'Section description placeholder 3, help text about section meaning.' },
    { id: 4, title: 'Section title placeholder 4', description: 'Section description placeholder 4, help text about section meaning.' },
    { id: 5, title: 'Section title placeholder 5', description: 'Section description placeholder 5, help text about section meaning.' },
    { id: 6, title: 'Section title placeholder 6', description: 'Section description placeholder 6, help text about section meaning.' },
    { id: 7, title: 'Section title placeholder 7', description: 'Section description placeholder 7, help text about section meaning.' },
    { id: 8, title: 'Section title placeholder 8', description: 'Section description placeholder 8, help text about section meaning.' },
  ];

  questions: Question[] = [
    { id: 1, sectionId: 1, title: 'Kaj vam je bilo najbolj vsec na razstavi?', type: "singleChoice", possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek' ] },
    { id: 2, sectionId: 1, title: 'Kaj ste si najbolj zapomnili o razstavi?', type: "multipleChoice", possibleAnswers: [ 'metulji', 'clovesko telo', 'zdravstvni oddelek', 'geografija pokrajine' ] },
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.selectedSection = id ? +id : null;
  }

}

interface Section {
  id: number;
  title: String;
  description?: String;
}

interface Question {
  id: number;
  sectionId: number;
  title: String;
  description?: String;
  type: QuestionType;
  possibleAnswers: String[];
}

type QuestionType = 'singleChoice' | 'multipleChoice';
