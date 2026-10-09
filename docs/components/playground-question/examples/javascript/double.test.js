import { describe, it, expect } from '@tp/test';
import { double } from './double.js';
describe('Double a number', () => {
  it('doubles positive numbers', () => expect(double(3)).to.equal(6));
  it('preserves zero', () => expect(double(0)).to.equal(0));
  it('doubles negative numbers', () => expect(double(-2)).to.equal(-4));
});
