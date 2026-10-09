export function add(a, b) {
  return a + b;
}

export class Counter {
  value = 0;

  increment() {
    this.value += 1;
  }

  reset() {
    this.value = 0;
  }
}

console.log('This is a JavaScript playground with tests!');
const counter = new Counter();
counter.increment();
console.log(`Counter value: ${counter.value}`);