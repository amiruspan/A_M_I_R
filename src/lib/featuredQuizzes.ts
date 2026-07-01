import type { Quiz } from './quizTypes';

export const featuredQuizzes: Quiz[] = [
  {
    id: 'featured-math-plus',
    user_id: null,
    title: 'Math Challenge Plus',
    description: 'Harder math with fractions, percent, and powers.',
    share_code: '91000016',
    is_public: true,
    game_mode: 'hardcore',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'What is 3/4 of 80?', options: ['45', '50', '60', '70'], correctIndex: 2 },
      { text: 'What is 2 to the power of 6?', options: ['32', '48', '64', '128'], correctIndex: 2 },
      { text: 'A price goes from 200 to 250. What is the percent increase?', options: ['20%', '25%', '30%', '50%'], correctIndex: 1 },
      { text: 'What is the square root of 196?', options: ['12', '13', '14', '16'], correctIndex: 2 },
      { text: 'Solve: 5x = 45. What is x?', options: ['7', '8', '9', '10'], correctIndex: 2 },
    ],
  },
  {
    id: 'featured-coding-basics',
    user_id: null,
    title: 'Coding Basics',
    description: 'Programming ideas for beginners.',
    share_code: '91000022',
    is_public: true,
    game_mode: 'normal',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'What is a variable used for?', options: ['Store data', 'Paint pixels', 'Charge battery', 'Open doors'], correctIndex: 0 },
      { text: 'Which value is boolean?', options: ['Maybe', 'True', 'Blue', '100px'], correctIndex: 1 },
      { text: 'What does a loop do?', options: ['Repeats actions', 'Deletes internet', 'Draws only circles', 'Stops all code'], correctIndex: 0 },
      { text: 'Which symbol often means strict equality in JavaScript?', options: ['=', '==', '===', '=>'], correctIndex: 2 },
      { text: 'What is a bug in code?', options: ['An error', 'A button', 'A server', 'A color'], correctIndex: 0 },
    ],
  },
  {
    id: 'featured-fast-math',
    user_id: null,
    title: 'Fast Math',
    description: 'Math warm-up with quick calculations. Математика.',
    share_code: '91000028',
    is_public: true,
    game_mode: 'blitz',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'What is 27 + 36?', options: ['53', '61', '63', '73'], correctIndex: 2 },
      { text: 'What is 9 x 7?', options: ['54', '63', '72', '81'], correctIndex: 1 },
      { text: 'What is 100 - 38?', options: ['52', '58', '62', '68'], correctIndex: 2 },
      { text: 'What is 48 / 6?', options: ['6', '7', '8', '9'], correctIndex: 2 },
      { text: 'What is 11 x 11?', options: ['111', '121', '131', '144'], correctIndex: 1 },
    ],
  },
  {
    id: 'featured-fractions',
    user_id: null,
    title: 'Fractions Practice',
    description: 'Math quiz about fractions and decimals. Математика.',
    share_code: '91000029',
    is_public: true,
    game_mode: 'normal',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'What is 1/2 + 1/4?', options: ['1/4', '1/2', '3/4', '1'], correctIndex: 2 },
      { text: 'What is 0.5 as a fraction?', options: ['1/2', '1/3', '1/4', '2/5'], correctIndex: 0 },
      { text: 'Which fraction is equal to 2/4?', options: ['1/2', '1/3', '3/4', '4/8'], correctIndex: 0 },
      { text: 'What is 3/10 as a decimal?', options: ['0.03', '0.3', '3.0', '30'], correctIndex: 1 },
      { text: 'What is 1/5 of 50?', options: ['5', '10', '15', '20'], correctIndex: 1 },
    ],
  },
  {
    id: 'featured-geometry',
    user_id: null,
    title: 'Geometry Basics',
    description: 'Math quiz about shapes, angles, and area. Математика геометрия.',
    share_code: '91000030',
    is_public: true,
    game_mode: 'normal',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'How many degrees are in a right angle?', options: ['45', '60', '90', '180'], correctIndex: 2 },
      { text: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1 },
      { text: 'Area of a rectangle 5 by 4?', options: ['9', '18', '20', '25'], correctIndex: 2 },
      { text: 'How many degrees are in a triangle?', options: ['90', '120', '180', '360'], correctIndex: 2 },
      { text: 'Which shape has no corners?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], correctIndex: 2 },
    ],
  },
  {
    id: 'featured-algebra',
    user_id: null,
    title: 'Algebra Starter',
    description: 'Math quiz with simple equations. Математика алгебра.',
    share_code: '91000031',
    is_public: true,
    game_mode: 'hardcore',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'Solve: x + 7 = 15.', options: ['6', '7', '8', '9'], correctIndex: 2 },
      { text: 'Solve: 3x = 21.', options: ['6', '7', '8', '9'], correctIndex: 1 },
      { text: 'Solve: x - 4 = 10.', options: ['6', '10', '14', '16'], correctIndex: 2 },
      { text: 'What is 2x when x = 9?', options: ['11', '16', '18', '20'], correctIndex: 2 },
      { text: 'Solve: x / 5 = 4.', options: ['9', '15', '20', '25'], correctIndex: 2 },
    ],
  },
  {
    id: 'featured-kazakhstan',
    user_id: null,
    title: 'Kazakhstan Facts',
    description: 'Cities, nature, and culture of Kazakhstan.',
    share_code: '91000021',
    is_public: true,
    game_mode: 'normal',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Astana', 'Shymkent', 'Aktobe'], correctIndex: 1 },
      { text: 'Which city is famous for mountains nearby?', options: ['Almaty', 'Atyrau', 'Kostanay', 'Kyzylorda'], correctIndex: 0 },
      { text: 'What is the currency of Kazakhstan?', options: ['Som', 'Tenge', 'Ruble', 'Lira'], correctIndex: 1 },
      { text: 'What animal is linked with the steppe and nomad culture?', options: ['Horse', 'Penguin', 'Kangaroo', 'Panda'], correctIndex: 0 },
      { text: 'Which lake is shared by Kazakhstan and other countries?', options: ['Caspian Sea', 'Baikal', 'Victoria', 'Superior'], correctIndex: 0 },
    ],
  },
  {
    id: 'featured-final-boss',
    user_id: null,
    title: 'Final Boss Mix',
    description: 'A tougher mixed quiz for confident players.',
    share_code: '91000019',
    is_public: true,
    game_mode: 'final_boss',
    created_at: '2026-07-01T00:00:00.000Z',
    questions: [
      { text: 'Which country has the city Kyoto?', options: ['China', 'Japan', 'Thailand', 'Vietnam'], correctIndex: 1 },
      { text: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Machine Logic', 'Home Tool Main Link', 'Hyperlink Text Maker'], correctIndex: 0 },
      { text: 'Who developed the theory of relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Marie Curie'], correctIndex: 1 },
      { text: 'What is 18 x 7?', options: ['116', '124', '126', '136'], correctIndex: 2 },
      { text: 'Which gas do plants absorb for photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Helium', 'Nitrogen'], correctIndex: 1 },
    ],
  },
];

export function mergeFeaturedQuizzes(quizzes: Quiz[]) {
  const existingCodes = new Set(quizzes.map((quiz) => quiz.share_code));
  return [...quizzes, ...featuredQuizzes.filter((quiz) => !existingCodes.has(quiz.share_code))];
}

export function findFeaturedQuizByCode(code: string) {
  return featuredQuizzes.find((quiz) => quiz.share_code === code) ?? null;
}
