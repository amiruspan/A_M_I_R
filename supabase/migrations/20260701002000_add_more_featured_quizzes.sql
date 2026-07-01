insert into public.quizzes (id, user_id, title, description, share_code, is_public, game_mode, questions, created_at)
values
(
  '10000000-0000-4000-8000-000000000020',
  null,
  'English Words',
  'Vocabulary and simple grammar practice.',
  '91000020',
  true,
  'normal',
  '[
    {"text":"Which word means happy?","options":["Glad","Slow","Tiny","Cold"],"correctIndex":0},
    {"text":"Choose the correct sentence.","options":["She go home","She goes home","She going home","She gone home"],"correctIndex":1},
    {"text":"What is the opposite of early?","options":["Late","Fast","Bright","Young"],"correctIndex":0},
    {"text":"Which word is a noun?","options":["Run","Blue","Teacher","Quickly"],"correctIndex":2},
    {"text":"What is the plural of child?","options":["Childs","Children","Childes","Childrens"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000021',
  null,
  'Kazakhstan Facts',
  'Cities, nature, and culture of Kazakhstan.',
  '91000021',
  true,
  'normal',
  '[
    {"text":"What is the capital of Kazakhstan?","options":["Almaty","Astana","Shymkent","Aktobe"],"correctIndex":1},
    {"text":"Which lake is shared by Kazakhstan and other countries?","options":["Caspian Sea","Baikal","Victoria","Superior"],"correctIndex":0},
    {"text":"Which city is famous for mountains nearby?","options":["Almaty","Atyrau","Kostanay","Kyzylorda"],"correctIndex":0},
    {"text":"What animal is linked with the steppe and nomad culture?","options":["Horse","Penguin","Kangaroo","Panda"],"correctIndex":0},
    {"text":"What is the currency of Kazakhstan?","options":["Som","Tenge","Ruble","Lira"],"correctIndex":1}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000022',
  null,
  'Coding Basics',
  'Programming ideas for beginners.',
  '91000022',
  true,
  'normal',
  '[
    {"text":"What is a variable used for?","options":["Store data","Paint pixels","Charge battery","Open doors"],"correctIndex":0},
    {"text":"Which value is boolean?","options":["Maybe","True","Blue","100px"],"correctIndex":1},
    {"text":"What does a loop do?","options":["Repeats actions","Deletes internet","Draws only circles","Stops all code"],"correctIndex":0},
    {"text":"Which symbol often means strict equality in JavaScript?","options":["=","==","===","=>"],"correctIndex":2},
    {"text":"What is a bug in code?","options":["An error","A button","A server","A color"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000023',
  null,
  'Sports Mix',
  'Questions about different sports.',
  '91000023',
  true,
  'blitz',
  '[
    {"text":"Which sport uses a puck?","options":["Hockey","Tennis","Boxing","Golf"],"correctIndex":0},
    {"text":"How many rings are on the Olympic flag?","options":["4","5","6","7"],"correctIndex":1},
    {"text":"Which sport has a serve and a net?","options":["Tennis","Running","Skiing","Chess"],"correctIndex":0},
    {"text":"What sport is played at Wimbledon?","options":["Cricket","Tennis","Rugby","Basketball"],"correctIndex":1},
    {"text":"Which sport uses the term knockout?","options":["Boxing","Swimming","Cycling","Archery"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000024',
  null,
  'Animal World',
  'Wildlife and animal facts.',
  '91000024',
  true,
  'normal',
  '[
    {"text":"Which animal is the fastest on land?","options":["Cheetah","Lion","Horse","Wolf"],"correctIndex":0},
    {"text":"What do pandas mostly eat?","options":["Bamboo","Fish","Grass","Fruit only"],"correctIndex":0},
    {"text":"Which animal can change color?","options":["Chameleon","Elephant","Cow","Tiger"],"correctIndex":0},
    {"text":"What is a baby frog called?","options":["Cub","Tadpole","Calf","Chick"],"correctIndex":1},
    {"text":"Which animal is a mammal?","options":["Dolphin","Shark","Octopus","Turtle"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000025',
  null,
  'Art and Colors',
  'Painting, colors, and creativity.',
  '91000025',
  true,
  'normal',
  '[
    {"text":"What color do blue and yellow make?","options":["Green","Purple","Orange","Brown"],"correctIndex":0},
    {"text":"What tool is used to paint?","options":["Brush","Compass","Hammer","Keyboard"],"correctIndex":0},
    {"text":"Which artist painted the Mona Lisa?","options":["Leonardo da Vinci","Van Gogh","Picasso","Michelangelo"],"correctIndex":0},
    {"text":"What are red, blue, and yellow often called?","options":["Primary colors","Silent colors","Fast colors","Cold colors"],"correctIndex":0},
    {"text":"What is a sculpture?","options":["3D artwork","Math formula","Song lyric","Weather map"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000026',
  null,
  'Internet Safety',
  'Smart choices online.',
  '91000026',
  true,
  'normal',
  '[
    {"text":"What should you do with a password?","options":["Share it","Keep it private","Post it","Use your name only"],"correctIndex":1},
    {"text":"What is phishing?","options":["A trick to steal info","A sport","A music style","A drawing app"],"correctIndex":0},
    {"text":"Which password is stronger?","options":["123456","password","BlueTiger!82","qwerty"],"correctIndex":2},
    {"text":"What should you check before clicking a link?","options":["If it looks safe","Only the color","The font size","Nothing"],"correctIndex":0},
    {"text":"Who should you tell if something online feels unsafe?","options":["Trusted adult","Random user","Nobody","Only a bot"],"correctIndex":0}
  ]'::jsonb,
  now()
),
(
  '10000000-0000-4000-8000-000000000027',
  null,
  'World Capitals',
  'Capital cities around the world.',
  '91000027',
  true,
  'hardcore',
  '[
    {"text":"Capital of France?","options":["Paris","Lyon","Rome","Madrid"],"correctIndex":0},
    {"text":"Capital of Japan?","options":["Kyoto","Tokyo","Osaka","Seoul"],"correctIndex":1},
    {"text":"Capital of Canada?","options":["Toronto","Vancouver","Ottawa","Montreal"],"correctIndex":2},
    {"text":"Capital of Brazil?","options":["Rio de Janeiro","Brasilia","Sao Paulo","Salvador"],"correctIndex":1},
    {"text":"Capital of Australia?","options":["Sydney","Melbourne","Canberra","Perth"],"correctIndex":2}
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
