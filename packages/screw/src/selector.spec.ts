import * as faker from 'faker';
import { Map, Record, RecordOf } from 'immutable';
import moize from 'moize';

import { createSelector, ISelector } from './selector';

jest.unmock('immutable');
jest.mock('moize');
jest.mock('@mechanema/wedge');

interface ITestState {
  something: string;
}

const initialState: ITestState = {
  something: 'something',
};

const testStateFactory = Record(initialState);
const testState: RecordOf<ITestState> = testStateFactory();

beforeEach((): void => {
  jest.clearAllMocks();

  (moize as unknown as jest.Mock).mockImplementation((given: Function): Function => given);
  (moize.maxArgs as jest.Mock).mockReturnValue(moize);
});

describe('createSelector', (): void => {
  describe('simple without a namespace', (): void => {
    it('returns a memoized selector', (): void => {
      const givenSelectorFn = jest.fn();

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).toHaveBeenCalledWith(givenSelectorFn);
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });

    it('does not memoize an already-memoized method', (): void => {
      const givenSelectorFn = jest.fn();
      (givenSelectorFn as ISelector).isMoized = true;

      expect(createSelector(givenSelectorFn)).toEqual(givenSelectorFn);
      expect(moize).not.toHaveBeenCalled();
      expect(moize.maxArgs).not.toHaveBeenCalled();
    });

    it('returns a psuedo-selector for "constants"', (): void => {
      const givenSelectorFn = faker.random.word();

      const receivedSelector = createSelector(givenSelectorFn);

      expect(receivedSelector(testState)).toEqual(givenSelectorFn);
      expect(moize.maxArgs).toHaveBeenCalledWith(0);
      expect(moize).toHaveBeenCalled();
    });
  });

  describe('single-array complex', (): void => {
    it('creates a memoized selector', (): void => {
      const givenReturn = faker.random.word();
      const expectedReturn = faker.hacker.noun();
      const givenDependency = jest.fn().mockReturnValue(givenReturn);
      const givenSelectorFn = jest.fn().mockReturnValue(expectedReturn);
      const givenState = testState;

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

  describe('complex with pre-split aggregator', (): void => {
    it('creates a memoized selector', (): void => {
      const givenReturn = faker.random.word();
      const expectedReturn = faker.hacker.noun();
      const givenDependency = jest.fn().mockReturnValue(givenReturn);
      const givenSelectorFn = jest.fn().mockReturnValue(expectedReturn);
      const givenState = testState;

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


  describe('simple with a namespace', (): void => {
    it('creates a memoized selector with getSlice', (): void => {
      const givenNamespace = faker.random.word();
      const givenReturn = faker.random.words();
      const givenSelectorFn = jest.fn().mockReturnValue(givenReturn);
      const givenSliceState = testState;
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
