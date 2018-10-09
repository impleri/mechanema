import faker from 'faker';
import { INIT, KEY_STATE } from '@mechanema/wedge';
import getStateSelector from './get-state';
import createSelector from './selector';

jest.unmock('immutable');
jest.mock('./selector', () => jest.fn());

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
    createSelector.mock.calls[0][1](givenState);

    expect(createSelector).toBeCalledWith(givenNamespace, expect.any(Function));
    expect(givenState.get).toBeCalledWith(KEY_STATE, INIT);
  });

  it('wraps createSelector with custom args', () => {
    const givenNamespace = faker.random.word();
    const givenStateKey = faker.random.word();
    const givenInitState = faker.random.word();

    const givenState = {
      get: jest.fn(),
    };

    getStateSelector(givenNamespace, givenStateKey, givenInitState);
    createSelector.mock.calls[0][1](givenState);

    expect(createSelector).toBeCalledWith(givenNamespace, expect.any(Function));
    expect(givenState.get).toBeCalledWith(givenStateKey, givenInitState);
  });
});
