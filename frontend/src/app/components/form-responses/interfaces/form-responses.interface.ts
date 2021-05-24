import { QuestionTypes } from 'src/app/enums/question';

export interface QuestionOptions {
  text: string;
  sequence: number;
}

export interface FormQuestions {
  text: string;
  qtype: QuestionTypes;
  options: string;
  answers: string[];
}

export interface FormResponse {
  respondent_email: string;
  created_at: Date;
  questions: FormQuestions[];
}

export interface FormResponses {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  responses: FormResponse[];
}
