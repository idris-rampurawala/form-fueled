import { QuestionTypes } from 'src/app/enums/question';

export interface QuestionOptions {
  text: string;
  sequence: number;
}

export interface FormQuestions {
  id: number;
  text: string;
  qtype: QuestionTypes;
  options: QuestionOptions[];
  created_at: Date;
  updated_at: Date;
}

export interface FormAPIResponse {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  questions: FormQuestions[];
}
