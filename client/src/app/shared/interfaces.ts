export interface Section {
  id: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Question {
  id: number;
  sectionId: number;
  title: string;
  description?: string;
  type: QuestionType;
  content: AnswersType;
  possibleAnswers: Answer[];
  createdAt: Date;
  updatedAt?: Date;
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

// TODO: match interfaces with backend!!!!
