CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  score INTEGER
);

INSERT INTO users (name) VALUES
  ('Alice'),
  ('Bob'),
  ('Charlie');

INSERT INTO scores (user_id, score) VALUES
  (1, 18),
  (1, 20),
  (2, 12),
  (3, 15);

SELECT
  users.name,
  scores.score
FROM users
JOIN scores ON users.id = scores.user_id
ORDER BY scores.score DESC;