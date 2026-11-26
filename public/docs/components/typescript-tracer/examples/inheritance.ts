class Counter {
  value: number;
  constructor(value = 0) {
    this.value = value;
  }

  increment(): number {
    this.value += 1;
    return this.value;
  }
}

class StepCounter extends Counter {
  step: number;
  constructor(value: number, step: number) {
    super(value);
    this.step = step;
  }

  increment(): number {
    super.increment();
    this.value += this.step - 1;
    return this.value;
  }
}

const counter = new StepCounter(3, 2);
console.log(counter.increment());
console.log(counter.increment());
console.log(counter instanceof Counter);
