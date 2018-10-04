import faker from 'faker';
import { Map } from 'immutable';

jest.unmock('immutable');
jest.mock('moize', () => {
  const mockFn = jest.fn(given => given);
  mockFn.maxArgs = jest.fn(() => mockFn);

  return mockFn;
});
jest.mock('@mechanema/wedge');

import moize from 'moize';
import createSelector from './selector';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createSelector', () => {
  describe('simple without a namespace', () => {
    it('returns a memoized selector', () => {
      const givenSelectorFn = jest.fn();

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).toBeCalledWith(givenSelectorFn);
      expect(moize.maxArgs).not.toBeCalled();
    });

    it('does not memoize an already-memoized method', () => {
      const givenSelectorFn = jest.fn();
      givenSelectorFn.isMoized = true;

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).not.toBeCalled();
      expect(moize.maxArgs).not.toBeCalled();
    });

    it('returns a psuedo-selector for "constants"', () => {
      const givenSelectorFn = faker.random.word();

      const receivedSelector = createSelector(givenSelectorFn);

      expect(receivedSelector(Map())).toEqual(givenSelectorFn);
      expect(moize.maxArgs).toBeCalledWith(0);
      expect(moize).toBeCalled();
    });
  });

  describe('single-array complex', () => {
    it('creates a memoized selector', () => {
      const givenReturn = faker.random.word();
      const expectedReturn = faker.hacker.noun();
      const givenDependency = jest.fn(() => givenReturn);
      const givenSelectorFn = jest.fn(() => expectedReturn);
      const givenState = Map();

      const receivedSelector = createSelector([givenDependency, givenSelectorFn]);
      const receivedValue = receivedSelector(givenState);

      expect(receivedSelector).not.toEqual(givenSelectorFn);
      expect(receivedValue).toEqual(expectedReturn);
      expect(moize).toBeCalledWith(givenDependency);
      expect(moize).toBeCalledWith(givenSelectorFn);
      expect(givenDependency).toBeCalledWith(givenState);
      expect(givenSelectorFn).toBeCalledWith(givenReturn);
      expect(moize.maxArgs).not.toBeCalled();
    });
  });

  describe('complex with pre-split aggregator', () => {
    it('creates a memoized selector', () => {
      const givenReturn = faker.random.word();
      const expectedReturn = faker.hacker.noun();
      const givenDependency = jest.fn(() => givenReturn);
      const givenSelectorFn = jest.fn(() => expectedReturn);
      const givenState = Map();

      const receivedSelector = createSelector([givenDependency], givenSelectorFn);
      const receivedValue = receivedSelector(givenState);

      expect(receivedSelector).not.toEqual(givenSelectorFn);
      expect(receivedValue).toEqual(expectedReturn);
      expect(moize).toBeCalledWith(givenDependency);
      expect(moize).toBeCalledWith(givenSelectorFn);
      expect(givenDependency).toBeCalledWith(givenState);
      expect(givenSelectorFn).toBeCalledWith(givenReturn);
      expect(moize.maxArgs).not.toBeCalled();
    });
  });


  describe('simple with a namespace', () => {
    it('creates a memoized selector with getSlice', () => {
      const givenNamespace = faker.random.word();
      const givenReturn = faker.random.words();
      const givenSelectorFn = jest.fn(() => givenReturn);
      const givenSliceState = Map({
        inSlice: true
      });
      const givenState = Map({
        [givenNamespace]: givenSliceState
      });

      const receivedSelector = createSelector(givenNamespace, givenSelectorFn);
      const receivedValue = receivedSelector(givenState);

      expect(receivedSelector).not.toEqual(givenSelectorFn);
      expect(receivedValue).toEqual(givenReturn);
      expect(moize).toHaveBeenCalledTimes(2);
      expect(moize).toBeCalledWith(givenSelectorFn);
      expect(givenSelectorFn).toBeCalledWith(givenSliceState);
      expect(moize.maxArgs).not.toBeCalled();
    });
  });
});
