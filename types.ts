export interface Question {
  id: string;
  text: string;
}

export interface TravaCategory {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface UserData {
  name: string;
  phone: string;
}

export type Answers = Record<string, number>; // questionId -> score

export interface TravaResult {
  travaTitle: string;
  average: number;
  totalScore: number;
}

export interface Submission {
  id: string;
  submittedAt: string;
  userData: UserData;
  answers: Answers;
}