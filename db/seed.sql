-- Insert Users
INSERT INTO users (username, created_at) VALUES
('player1', NOW()),
('player2', NOW()),
('globemaster', NOW()),
('wanderlust', NOW()),
('geoguru', NOW());

-- Insert Destinations
INSERT INTO destinations (city, country, clues, fun_facts, trivia, options) VALUES
(
  'Paris',
  'France',
  ARRAY['Home to a famous iron tower that sparkles at night', 'Known as the City of Light', 'Has underground tunnels filled with skulls'],
  ARRAY['The Eiffel Tower was meant to be temporary', 'Has only one stop sign in the entire city'],
  ARRAY['Originally a Roman city called Lutetia', 'Most visited city in the world'],
  '["Paris, France", "London, UK", "Rome, Italy", "Madrid, Spain"]'::jsonb
),
(
  'Tokyo',
  'Japan',
  ARRAY['Has the world''s busiest pedestrian crossing', 'Home to the oldest fish market', 'More Michelin stars than any other city'],
  ARRAY['Was formerly called Edo', 'Has over 160,000 restaurants'],
  ARRAY['Has vending machines for live crabs', 'Home to the world''s busiest train station'],
  '["Seoul, South Korea", "Beijing, China", "Tokyo, Japan", "Bangkok, Thailand"]'::jsonb
),
(
  'New York',
  'USA',
  ARRAY['Home to a famous green statue', 'Known as the Big Apple', 'Has a park larger than Monaco'],
  ARRAY['The subway system has 472 stations', 'Over 800 languages are spoken here'],
  ARRAY['Was originally called New Amsterdam', 'First capital of the United States'],
  '["Chicago, USA", "New York, USA", "Toronto, Canada", "Boston, USA"]'::jsonb
),
(
  'Dubai',
  'UAE',
  ARRAY['Home to the world''s tallest building', 'Has artificial islands shaped like palm trees', 'Indoor ski resort in the desert'],
  ARRAY['Only 15% of population are locals', 'Has robot camel jockeys'],
  ARRAY['Was a fishing village 60 years ago', 'Has the world''s largest mall'],
  '["Abu Dhabi, UAE", "Dubai, UAE", "Doha, Qatar", "Riyadh, Saudi Arabia"]'::jsonb
),
(
  'Sydney',
  'Australia',
  ARRAY['Famous opera house shaped like shells', 'Iconic bridge nicknamed "The Coathanger"', 'Oldest city in Australia'],
  ARRAY['Built on 100 sunken valleys', 'Has the world''s largest natural harbor'],
  ARRAY['Was founded as a penal colony', 'Home to the world''s oldest surf lifesaving club'],
  '["Melbourne, Australia", "Sydney, Australia", "Brisbane, Australia", "Perth, Australia"]'::jsonb
);

-- Insert Game Sessions (removed is_completed)
INSERT INTO game_sessions (user_id, score, correct_answers, total_questions, share_code) VALUES
((SELECT id FROM users WHERE username = 'player1'), 80, 4, 5, 'share123'),
((SELECT id FROM users WHERE username = 'player2'), 60, 3, 5, 'share456'),
((SELECT id FROM users WHERE username = 'globemaster'), 100, 5, 5, 'share789'),
((SELECT id FROM users WHERE username = 'wanderlust'), 40, 2, 5, 'share012'),
((SELECT id FROM users WHERE username = 'geoguru'), 20, 1, 5, 'share345');

-- Insert Game Rounds
INSERT INTO game_rounds (session_id, destination_id, user_answer, is_correct, time_taken) VALUES
((SELECT id FROM game_sessions WHERE share_code = 'share123'), (SELECT id FROM destinations WHERE city = 'Paris'), 'Paris, France', true, 15),
((SELECT id FROM game_sessions WHERE share_code = 'share123'), (SELECT id FROM destinations WHERE city = 'Tokyo'), 'Tokyo, Japan', true, 20),
((SELECT id FROM game_sessions WHERE share_code = 'share456'), (SELECT id FROM destinations WHERE city = 'Dubai'), 'Dubai, UAE', true, 25),
((SELECT id FROM game_sessions WHERE share_code = 'share789'), (SELECT id FROM destinations WHERE city = 'Sydney'), 'Sydney, Australia', true, 18),
((SELECT id FROM game_sessions WHERE share_code = 'share012'), (SELECT id FROM destinations WHERE city = 'New York'), 'Boston, USA', false, 30); 