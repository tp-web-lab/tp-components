CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_age ON users(age);

INSERT INTO users (name, age) VALUES
  ('Alice', 25),
  ('Bob', 30),
  ('Charlie', 22),
  ('Diane', 30),
  ('Emma', 28);