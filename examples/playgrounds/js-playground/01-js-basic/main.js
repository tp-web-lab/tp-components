console.log('Hello from tp-js-playground');

const now = new Date();
console.info('Current time:', now);

const hour = now.getHours();

console.group('Time checks');

if (hour >= 22) {
  console.warn('It is getting late...');
} else {
  console.info('It is not late yet.');
}

if (hour < 4) {
  console.error('Go to sleep 😴');
} else {
  console.info('You are not in the very late night range.');
}

console.groupEnd();

console.group('User data');

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'editor' },
];

console.table(users);

console.groupCollapsed('Raw users object');
console.log(users);
console.groupEnd();

console.groupEnd();

console.assert(2 + 2 === 4, 'Math is broken');
console.assert(2 + 2 === 5, 'Expected 5'); // This will log an assertion error with the message "Expected 5"

console.count('loop');
console.count('loop');
console.countReset('loop');
console.count('loop');

console.time('work');

const MAX = 100000;
for (let i = 0; i < MAX; i++) {
  Math.sqrt(i);
  if (i === MAX / 2) {
    console.timeLog('work', `after ${MAX / 2} loops`);
  }
}

console.timeLog('work', `after ${MAX} loops`);
console.timeEnd('work');

console.log('Example finished');