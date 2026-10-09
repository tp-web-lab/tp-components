import { describe, expect, it } from '@tp/test';
import { add, Counter } from './main.js';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).to.equal(5);
  });

  it('supports negative numbers', () => {
    expect(add(-2, 3)).to.equal(1);
  });
});

describe('Counter', () => {
  it('starts at zero', () => {
    const counter = new Counter();

    expect(counter.value).to.equal(0);
  });

  it('increments value', () => {
    const counter = new Counter();

    counter.increment();

    expect(counter.value).to.equal(1);
  });

  it('resets value', () => {
    const counter = new Counter();

    counter.increment();
    counter.reset();

    expect(counter.value).to.equal(0);
  });
});
