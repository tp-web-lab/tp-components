CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL
);

INSERT INTO users (name, age) VALUES
  ('Alice', 25),
  ('Bob', 30),
  ('Charlie', 22);

SELECT *
FROM users
ORDER BY age ASC;