import { QuestionTypes } from 'src/app/enums/question';

export interface QuestionOptions {
  text: string;
  sequence: number;
}

export interface FormQuestions {
  id: string;
  text: string;
  qtype: QuestionTypes;
  options: string;
  updated_at: Date;
  created_at: Date;
}

export interface UserForms {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  questions: FormQuestions[];
}
