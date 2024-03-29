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
  image?: File;
  imageName?: string;
  imageType?: string;
  imageData?: NodeJsBuffer;
  count: number;
  order: number;
}

interface NodeJsBuffer {
  type: string;
  data: Uint8Array;
}

export interface AnswerEdit extends Answer {
  action: 'DELETE' | 'UPDATE' | 'CREATE';
}

export interface UserDetails {
  id: number;
  username: string;
  exp: number;
}

export interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  username: string;
  password: string;
}
