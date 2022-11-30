export interface Section {
  id: number;
  title: string;
  description?: string;
}

export interface Question {
  id: number;
  sectionId: number;
  title: string;
  description?: string;
  type: QuestionType;
  possibleAnswers: Answer[];
}

export type QuestionType = 'singleChoice' | 'multipleChoice';

export interface Answer {
  id: number;
  questionId?: number;
  text?: string;
  image?: string;
  selected: boolean;
  order: number;
}

export type AnswersType = 'text' | 'image';
