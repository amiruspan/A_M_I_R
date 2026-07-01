export type Role = 'teacher' | 'student';

export type Profile = {
  user_id: string;
  role: Role;
  display_name: string;
  coins: number;
  xp: number;
  last_daily_bonus: string | null;
  earned_badge_ids: string[];
  owned_skin_ids: string[];
  active_skin_id: string;
  owned_name_frame_ids: string[];
  active_name_frame_id: string;
};

export type LocalUser = Profile & {
  email: string;
};

export type StoredAccount = LocalUser & {
  password: string;
};

export type QuizQuestion = {
  text: string;
  options: string[];
  correctIndex: number;
};

export type GameMode = 'normal' | 'hardcore' | 'blitz' | 'practice' | 'final_boss';

export type Quiz = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  share_code: string;
  is_public: boolean;
  game_mode: GameMode;
  questions: QuizQuestion[];
  created_at: string;
};

export type Attempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  player_name: string;
  score: number;
  total: number;
  created_at: string;
};

export type HostSession = {
  id: string;
  quiz_id: string;
  user_id: string;
  join_code: string;
  is_active: boolean;
  created_at: string;
};

export type HostParticipant = {
  id: string;
  session_id: string;
  player_name: string;
  joined_at: string;
};
