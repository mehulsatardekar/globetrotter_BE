export interface User {
  id: string;
  username: string;
  score: number;
  games_played: number;
  highest_score: number;
  created_at: Date;
}

export interface GameSession {
  id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  share_code: string;
  expires_at: Date;
  created_at: Date;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  clues: string[];
  fun_facts: string[];
  trivia: string[];
  options: string[];
  created_at: Date;
}