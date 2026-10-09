import { describe, it, expect } from '@tp/test';
import { multiply } from './main.js';

describe('multiply', () => {
  it('multiplies numbers', () => {
    expect(multiply(2, 3)).to.equal(7); // This will fail, as 2 * 3 is 6, not 7
  });

  it('handles zero', () => {
    expect(multiply(5, 0)).to.equal(0);
  });
});
