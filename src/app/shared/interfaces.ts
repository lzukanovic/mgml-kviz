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
  possibleAnswers: string[];
}

export type QuestionType = 'singleChoice' | 'multipleChoice';
