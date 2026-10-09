import { describe, expect, it } from '@tp/test';
import { delayValue, fetchUserName } from './main.js';

describe('async helpers', () => {
  it('resolves a delayed value', async () => {
    const value = await delayValue('hello');

    expect(value).to.equal('hello');
  });

  it('fetches a user name', async () => {
    const name = await fetchUserName(1);

    expect(name).to.equal('Alice');
  });

  it('rejects unknown users', async () => {
    try {
      await fetchUserName(999);
      throw new Error('Expected fetchUserName to reject.');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect((error as Error).message).to.equal('Unknown user: 999');
    }
  });
});