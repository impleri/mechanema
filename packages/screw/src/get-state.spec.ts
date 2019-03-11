import { INIT, KEY_STATE } from '@mechanema/wedge';
import { getStateSelector } from './get-state';

import { createSelector } from './selector';

import faker = require('faker');

jest.unmock('immutable');
jest.mock('./selector');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getStateSelector', () => {
  it('wraps createSelector with default args', () => {
    const givenNamespace = faker.random.word();

    const givenState = {
      get: jest.fn(),
    };

    getStateSelector(givenNamespace);
    (createSelector as jest.Mock).mock.calls[0][1](givenState);

    expect(createSelector).toHaveBeenCalledWith(givenNamespace, expect.any(Function));
    expect(givenState.get).toHaveBeenCalledWith(KEY_STATE, INIT);
  });

  it('wraps createSelector with custom args', () => {
    const givenNamespace = faker.random.word();
    const givenStateKey = faker.random.word();
    const givenInitState = faker.random.word();

    const givenState = {
      get: jest.fn(),
    };

    getStateSelector(givenNamespace, givenStateKey, givenInitState);
    (createSelector as jest.Mock).mock.calls[0][1](givenState);

    expect(createSelector).toHaveBeenCalledWith(givenNamespace, expect.any(Function));
    expect(givenState.get).toHaveBeenCalledWith(givenStateKey, givenInitState);
  });
});
