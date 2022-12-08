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
  answers: Answer[];
  createdAt: Date;
  updatedAt?: Date;
}

export type QuestionType = 'singleChoice' | 'multipleChoice';

export interface Answer {
  id: number;
  questionId?: number;
  text?: string;
  image?: string;
  count: number;
  order: number;
}

export interface AnswerEdit extends Answer {
  action: 'DELETE' | 'UPDATE' | 'CREATE';
}
