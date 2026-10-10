export async function delayValue<T>(value: T, delay = 10): Promise<T> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });

  return value;
}

export async function fetchUserName(id: number): Promise<string> {
  const users = new Map<number, string>([
    [1, 'Alice'],
    [2, 'Bob'],
  ]);

  const name = users.get(id);

  if (name === undefined) {
    throw new Error(`Unknown user: ${id}`);
  }

  return delayValue(name);
}