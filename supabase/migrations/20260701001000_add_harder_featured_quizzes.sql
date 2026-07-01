insert into public.quizzes (id, user_id, title, description, share_code, is_public, game_mode, questions, created_at)
values
(
  '10000000-0000-4000-8000-000000000016',
  null,
  'Math Challenge Plus',
  'Harder math with fractions, percent, and powers.',
  '91000016',
  true,
  'hardcore',
  '[
    {"text":"What is 3/4 of 80?","options":["45","50","60","70"],"correctIndex":2},
    {"text":"What is 2 to the power of 6?","options":["32","48","64","128"],"correctIndex":2},
    {"text":"A price goes from 200 to 250. What is the percent increase?","options":["20%","25%","30%","50%"],"correctIndex":1},
    {"text":"What is the square root of 196?","options":["12","13","14","16"],"correctIndex":2},
    {"text":"Solve: 5x = 45. What is x?","options":["7","8","9","10"],"correctIndex":2},
    {"text":"What is 0.25 as a fraction?","options":["1/2","1/3","1/4","1/5"],"correctIndex":2}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000017',
  null,
  'Science Expert',
  'Atoms, energy, biology, and Earth science.',
  '91000017',
  true,
  'blitz',
  '[
    {"text":"What particle has a negative charge?","options":["Proton","Neutron","Electron","Photon"],"correctIndex":2},
    {"text":"What is the chemical symbol for potassium?","options":["P","K","Po","Pt"],"correctIndex":1},
    {"text":"Which organelle makes energy for the cell?","options":["Nucleus","Ribosome","Mitochondria","Vacuole"],"correctIndex":2},
    {"text":"What type of energy is stored in a stretched rubber band?","options":["Thermal","Elastic potential","Nuclear","Sound"],"correctIndex":1},
    {"text":"Which layer of Earth is liquid metal?","options":["Crust","Mantle","Outer core","Inner core"],"correctIndex":2},
    {"text":"What force keeps planets in orbit around the Sun?","options":["Friction","Magnetism","Gravity","Static electricity"],"correctIndex":2}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000018',
  null,
  'Logic Lab',
  'Patterns and careful thinking.',
  '91000018',
  true,
  'hardcore',
  '[
    {"text":"What comes next: 3, 6, 12, 24?","options":["30","36","42","48"],"correctIndex":3},
    {"text":"If all Bloops are Razzies and all Razzies are Lazzies, then Bloops are what?","options":["Lazzies","Not Lazzies","Only Razzies","Unknown"],"correctIndex":0},
    {"text":"Which word does not belong?","options":["Triangle","Square","Circle","Cube"],"correctIndex":3},
    {"text":"A clock shows 3:15. What is the angle between hour and minute hands?","options":["0 degrees","7.5 degrees","15 degrees","30 degrees"],"correctIndex":1},
    {"text":"What number is missing: 1, 4, 9, 16, ?","options":["20","24","25","36"],"correctIndex":2},
    {"text":"If today is Wednesday, what day is 10 days later?","options":["Friday","Saturday","Sunday","Monday"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000019',
  null,
  'Final Boss Mix',
  'A tougher mixed quiz for confident players.',
  '91000019',
  true,
  'final_boss',
  '[
    {"text":"Which country has the city Kyoto?","options":["China","Japan","Thailand","Vietnam"],"correctIndex":1},
    {"text":"What does HTML stand for?","options":["HyperText Markup Language","High Tech Machine Logic","Home Tool Main Link","Hyperlink Text Maker"],"correctIndex":0},
    {"text":"Who developed the theory of relativity?","options":["Isaac Newton","Albert Einstein","Nikola Tesla","Marie Curie"],"correctIndex":1},
    {"text":"What is 18 x 7?","options":["116","124","126","136"],"correctIndex":2},
    {"text":"Which gas do plants absorb for photosynthesis?","options":["Oxygen","Carbon dioxide","Helium","Nitrogen"],"correctIndex":1},
    {"text":"Which ocean is between Africa and Australia?","options":["Atlantic","Pacific","Indian","Arctic"],"correctIndex":2}
  ]'::jsonb,
  now()
)
on conflict (id) do update
set title = excluded.title,
    description = excluded.description,
    share_code = excluded.share_code,
    is_public = excluded.is_public,
    game_mode = excluded.game_mode,
    questions = excluded.questions;
