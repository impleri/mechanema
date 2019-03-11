import { Map } from 'immutable';
import moize from 'moize';

import { createSelector, ISelector } from './selector';

import faker = require('faker');

jest.unmock('immutable');
jest.mock('moize', () => {
  const mockFn = jest.fn(given => given);
  (mockFn as any).maxArgs = jest.fn(() => mockFn);

  return mockFn;
});
jest.mock('@mechanema/wedge');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createSelector', () => {
  describe('simple without a namespace', () => {
    it('returns a memoized selector', () => {
      const givenSelectorFn = jest.fn();

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).toHaveBeenCalledWith(givenSelectorFn);
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });

    it('does not memoize an already-memoized method', () => {
      const givenSelectorFn = jest.fn();
      (givenSelectorFn as ISelector).isMoized = true;

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).not.toHaveBeenCalled();
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });

    it('returns a psuedo-selector for "constants"', () => {
      const givenSelectorFn = faker.random.word();

      const receivedSelector = createSelector(givenSelectorFn);

      expect(receivedSelector(Map())).toEqual(givenSelectorFn);
      expect(moize.maxArgs).toHaveBeenCalledWith(0);
      expect(moize).toHaveBeenCalled();
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
      expect(moize).toHaveBeenCalledWith(givenDependency);
      expect(moize).toHaveBeenCalledWith(givenSelectorFn);
      expect(givenDependency).toHaveBeenCalledWith(givenState);
      expect(givenSelectorFn).toHaveBeenCalledWith(givenReturn);
      expect(moize.maxArgs).not.toHaveBeenCalled();
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
      expect(moize).toHaveBeenCalledWith(givenDependency);
      expect(moize).toHaveBeenCalledWith(givenSelectorFn);
      expect(givenDependency).toHaveBeenCalledWith(givenState);
      expect(givenSelectorFn).toHaveBeenCalledWith(givenReturn);
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });
  });


  describe('simple with a namespace', () => {
    it('creates a memoized selector with getSlice', () => {
      const givenNamespace = faker.random.word();
      const givenReturn = faker.random.words();
      const givenSelectorFn = jest.fn(() => givenReturn);
      const givenSliceState = Map({
        inSlice: true,
      });
      const givenState = Map({
        [givenNamespace]: givenSliceState,
      });

      const receivedSelector = createSelector(givenNamespace, givenSelectorFn);
      const receivedValue = receivedSelector(givenState);

      expect(receivedSelector).not.toEqual(givenSelectorFn);
      expect(receivedValue).toEqual(givenReturn);
      expect(moize).toHaveBeenCalledTimes(2);
      expect(moize).toHaveBeenCalledWith(givenSelectorFn);
      expect(givenSelectorFn).toHaveBeenCalledWith(givenSliceState);
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });
  });
});
