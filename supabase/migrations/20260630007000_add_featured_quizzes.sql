alter table public.quizzes
  alter column user_id drop not null;

insert into public.quizzes (id, user_id, title, description, share_code, is_public, game_mode, questions, created_at)
values
(
  '10000000-0000-4000-8000-000000000001',
  null,
  'Space Explorer',
  'Planets, stars, and space facts.',
  '91000001',
  true,
  'normal',
  '[
    {"text":"Which planet is known as the Red Planet?","options":["Mars","Venus","Jupiter","Mercury"],"correctIndex":0},
    {"text":"What is the Sun?","options":["A planet","A star","A comet","A moon"],"correctIndex":1},
    {"text":"Which planet has the most famous rings?","options":["Saturn","Earth","Neptune","Mars"],"correctIndex":0},
    {"text":"What do astronauts wear in space?","options":["Spacesuits","Raincoats","Armor","Lab coats"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000002',
  null,
  'Football Legends',
  'A quick quiz about world football.',
  '91000002',
  true,
  'normal',
  '[
    {"text":"How many players are on the field for one football team?","options":["9","10","11","12"],"correctIndex":2},
    {"text":"What country won the 2022 FIFA World Cup?","options":["France","Argentina","Brazil","Spain"],"correctIndex":1},
    {"text":"What is a goalkeeper allowed to use in the penalty area?","options":["Hands","Helmet","Stick","Basket"],"correctIndex":0},
    {"text":"How long is a standard football match?","options":["60 minutes","75 minutes","90 minutes","120 minutes"],"correctIndex":2}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000003',
  null,
  'Minecraft Basics',
  'Blocks, mobs, and crafting.',
  '91000003',
  true,
  'normal',
  '[
    {"text":"What block do you usually mine first?","options":["Diamond","Wood","Obsidian","Emerald"],"correctIndex":1},
    {"text":"Which mob explodes near the player?","options":["Creeper","Pig","Zombie","Villager"],"correctIndex":0},
    {"text":"What do you need to make torches?","options":["Coal and sticks","Water and sand","Iron and wool","Gold and dirt"],"correctIndex":0},
    {"text":"Which dimension has the Ender Dragon?","options":["Nether","Overworld","The End","Deep Dark"],"correctIndex":2}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000004',
  null,
  'Human Body',
  'Simple biology facts.',
  '91000004',
  true,
  'normal',
  '[
    {"text":"Which organ pumps blood?","options":["Lungs","Heart","Brain","Stomach"],"correctIndex":1},
    {"text":"What do lungs help us do?","options":["Breathe","See","Hear","Run electricity"],"correctIndex":0},
    {"text":"How many bones does an adult human have?","options":["106","206","306","406"],"correctIndex":1},
    {"text":"Which sense uses the tongue?","options":["Taste","Sight","Touch","Hearing"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000005',
  null,
  'World Geography',
  'Countries, oceans, and landmarks.',
  '91000005',
  true,
  'normal',
  '[
    {"text":"What is the largest ocean?","options":["Atlantic","Indian","Pacific","Arctic"],"correctIndex":2},
    {"text":"Which country has the city Tokyo?","options":["Japan","China","Korea","Thailand"],"correctIndex":0},
    {"text":"What is the tallest mountain on Earth?","options":["K2","Everest","Denali","Elbrus"],"correctIndex":1},
    {"text":"Which continent is Egypt in?","options":["Asia","Africa","Europe","Australia"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000006',
  null,
  'Movie Magic',
  'Films and characters everyone knows.',
  '91000006',
  true,
  'normal',
  '[
    {"text":"Who is the wizard with a lightning scar?","options":["Harry Potter","Frodo","Luke Skywalker","Shrek"],"correctIndex":0},
    {"text":"Which movie has a toy cowboy named Woody?","options":["Toy Story","Cars","Frozen","Coco"],"correctIndex":0},
    {"text":"What color is Shrek?","options":["Blue","Green","Red","Purple"],"correctIndex":1},
    {"text":"Which hero uses a shield with a star?","options":["Iron Man","Captain America","Thor","Hulk"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000007',
  null,
  'Music Mix',
  'Instruments and music basics.',
  '91000007',
  true,
  'normal',
  '[
    {"text":"Which instrument has black and white keys?","options":["Piano","Drum","Violin","Flute"],"correctIndex":0},
    {"text":"What do singers use most?","options":["Voice","Hammer","Brush","Compass"],"correctIndex":0},
    {"text":"Which instrument is played with sticks?","options":["Drums","Guitar","Harp","Trumpet"],"correctIndex":0},
    {"text":"What is a group of musicians called?","options":["Team","Band","Class","Crew"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000008',
  null,
  'Tech Future',
  'Computers, AI, and gadgets.',
  '91000008',
  true,
  'normal',
  '[
    {"text":"What does AI stand for?","options":["Artificial Intelligence","Auto Internet","Active Idea","Apple Inside"],"correctIndex":0},
    {"text":"Which device is used to type?","options":["Keyboard","Speaker","Monitor","Router"],"correctIndex":0},
    {"text":"What stores files online?","options":["Cloud storage","Pencil case","Battery","Screen"],"correctIndex":0},
    {"text":"What does a browser open?","options":["Websites","Shoes","Doors","Bottles"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000009',
  null,
  'Food Around the World',
  'Tasty facts about famous dishes.',
  '91000009',
  true,
  'normal',
  '[
    {"text":"Sushi is strongly linked with which country?","options":["Japan","Italy","Mexico","India"],"correctIndex":0},
    {"text":"Pizza is famous from which country?","options":["Italy","Canada","Brazil","Norway"],"correctIndex":0},
    {"text":"What is chocolate made from?","options":["Cocoa beans","Rice","Potatoes","Apples"],"correctIndex":0},
    {"text":"Which food is usually in tacos?","options":["Tortilla","Noodles","Pancake","Croissant"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000010',
  null,
  'History Snap',
  'Fast history questions.',
  '91000010',
  true,
  'normal',
  '[
    {"text":"Where were the pyramids of Giza built?","options":["Egypt","Greece","Peru","India"],"correctIndex":0},
    {"text":"Who was the first person on the Moon?","options":["Neil Armstrong","Albert Einstein","Isaac Newton","Yuri Gagarin"],"correctIndex":0},
    {"text":"The Roman Empire started around which city?","options":["Rome","Paris","London","Berlin"],"correctIndex":0},
    {"text":"What was the Silk Road used for?","options":["Trade","Swimming","Space travel","Mining diamonds"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000011',
  null,
  'Hardcore Math',
  'One mistake ends the run.',
  '91000011',
  true,
  'hardcore',
  '[
    {"text":"What is 12 x 8?","options":["86","96","108","112"],"correctIndex":1},
    {"text":"What is 144 divided by 12?","options":["10","11","12","14"],"correctIndex":2},
    {"text":"What is 15% of 200?","options":["15","20","30","40"],"correctIndex":2},
    {"text":"What is 7 squared?","options":["42","49","56","63"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000012',
  null,
  'Gaming Trivia',
  'Popular games and gaming facts.',
  '91000012',
  true,
  'normal',
  '[
    {"text":"What does NPC mean?","options":["Non-player character","New power card","Night play code","No point challenge"],"correctIndex":0},
    {"text":"Which game has a battle bus?","options":["Fortnite","Tetris","Chess","Portal"],"correctIndex":0},
    {"text":"What genre is FIFA?","options":["Sports","Horror","Puzzle","Racing"],"correctIndex":0},
    {"text":"What is a speedrun?","options":["Finishing fast","Playing slowly","Building houses","Drawing maps"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000013',
  null,
  'Nature Facts',
  'Plants, weather, and Earth.',
  '91000013',
  true,
  'normal',
  '[
    {"text":"What do plants use to make food?","options":["Sunlight","Plastic","Metal","Glass"],"correctIndex":0},
    {"text":"What gas do humans breathe in most for survival?","options":["Oxygen","Helium","Neon","Smoke"],"correctIndex":0},
    {"text":"What causes thunder?","options":["Lightning heating air","Falling rocks","Ocean waves","Tree roots"],"correctIndex":0},
    {"text":"What is frozen water called?","options":["Ice","Steam","Dust","Oil"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000014',
  null,
  'Book Heroes',
  'Characters from famous stories.',
  '91000014',
  true,
  'normal',
  '[
    {"text":"Who falls into Wonderland?","options":["Alice","Hermione","Katniss","Matilda"],"correctIndex":0},
    {"text":"Who lives at 221B Baker Street?","options":["Sherlock Holmes","Peter Pan","Dracula","Robin Hood"],"correctIndex":0},
    {"text":"Who is the author of The Hobbit?","options":["J.R.R. Tolkien","Roald Dahl","Mark Twain","Jane Austen"],"correctIndex":0},
    {"text":"Which story has Hogwarts?","options":["Harry Potter","Narnia","Percy Jackson","The Hobbit"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000015',
  null,
  'Brain Teasers',
  'Logic and quick thinking.',
  '91000015',
  true,
  'hardcore',
  '[
    {"text":"What comes next: 2, 4, 8, 16?","options":["18","24","32","64"],"correctIndex":2},
    {"text":"If you have 3 apples and take 2, how many do you have?","options":["1","2","3","5"],"correctIndex":1},
    {"text":"Which month has 28 days?","options":["Only February","All months","January","December"],"correctIndex":1},
    {"text":"What has keys but cannot open locks?","options":["Piano","Door","Map","Clock"],"correctIndex":0}
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
