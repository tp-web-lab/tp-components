class Counter {
  constructor(value = 0) {
    this.value = value;
  }

  increment() {
    this.value += 1;
    return this.value;
  }
}

const counter = new Counter(3);
const alias = counter;
console.log(counter.increment());
console.log(alias.value);
console.log(alias === counter);
