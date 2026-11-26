class Counter {
  constructor(value = 0) {
    this.value = value;
  }

  increment() {
    this.value += 1;
    return this.value;
  }
}

class StepCounter extends Counter {
  constructor(value, step) {
    super(value);
    this.step = step;
  }

  increment() {
    super.increment();
    this.value += this.step - 1;
    return this.value;
  }
}

const counter = new StepCounter(3, 2);
console.log(counter.increment());
console.log(counter.increment());
console.log(counter instanceof Counter);
