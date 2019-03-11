// eslint-disable-next-line import/no-extraneous-dependencies
import { fromJS, List, Map } from 'immutable';
import { Action, Reducer } from 'redux';

import {
  createStateMachine,
  INIT,
  KEY_STATE,
  IStateMachineHash,
  traverseReducerArray,
} from './state-machine';

import faker = require('faker');

describe('state machine functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Initial constants', () => {
    it('are exported', () => {
      expect(`${INIT}`.length).toBeGreaterThan(0);
      expect(`${KEY_STATE}`.length).toBeGreaterThan(0);
    });
  });

  describe('traverseReducerArray', () => {
    it('returns an iterator for reducer slice methods', () => {
      const listKey = faker.random.word();
      const anotherKey = faker.random.word();
      const anotherValue = faker.random.number();
      const expectedAction = faker.hacker.verb();
      const newState = faker.hacker.noun();

      const initialState = Map({
        [KEY_STATE]: INIT,
        [listKey]: List([
          faker.lorem.sentence(),
        ]),
      });

      const firstAdditions = [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ];

      const expectedState = initialState.mergeDeep(fromJS({
        [KEY_STATE]: newState,
        [listKey]: List(firstAdditions),
        [anotherKey]: anotherValue,
      }));

      const reducers: Reducer[] = [
        (state, action) => {
          if (action.type === expectedAction) {
            return state.mergeDeep(Map({
              [KEY_STATE]: newState,
              [listKey]: List(firstAdditions),
            }));
          }

          return state;
        },
        (state, action) => {
          if (action.type === faker.lorem.slug()) {
            return state.merge(Map({
              [KEY_STATE]: faker.random.words(),
              [listKey]: List([]),
            }));
          }

          return state;
        },
        (state, action) => {
          if (action.type === expectedAction) {
            return state.merge(Map({
              [anotherKey]: anotherValue,
            }));
          }

          return state;
        },
      ];

      const reducerCallback = traverseReducerArray(reducers);
      expect(reducerCallback).toBeInstanceOf(Function);

      const givenAction = {
        type: expectedAction,
      };
      const finalState = reducerCallback(initialState, givenAction);
      expect(finalState).toEqual(expectedState);
    });
  });

  describe('createStateMachine', () => {
    let testHash: IStateMachineHash;
    let givenState = Map();
    let givenAction: Action;
    const initialState = Map({
      [faker.random.word()]: faker.lorem.paragraph(),
    });

    beforeEach(() => {
      jest.resetAllMocks();

      givenState = Map({
        [faker.random.word()]: faker.random.words(),
      });

      givenAction = {
        type: faker.random.word(),
      };

      testHash = {
        [INIT]: jest.fn(state => state),
      };
    });

    it('returns the default state if none provided', () => {
      const otherState = faker.random.word();
      testHash[otherState] = jest.fn(state => state);

      const reducer = createStateMachine(testHash);

      const receivedState = reducer(initialState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(initialState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
      expect(receivedState.equals(initialState)).toBe(true);
    });

    it('returns the given initial state if none provided', () => {
      const otherState = faker.random.word();
      testHash[otherState] = jest.fn(state => state);

      const reducer = createStateMachine(testHash, initialState);

      const receivedState = reducer(initialState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(initialState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
      expect(receivedState.equals(initialState)).toBe(true);
    });

    it('uses the default reducer method if current state is not matched', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine(testHash);

      reducer(givenState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
    });

    it('uses the given fallback reducer method if given state property is not matched', () => {
      const alternateStateKey = faker.random.word();

      const expectedState = faker.hacker.noun();
      givenState = givenState.set(alternateStateKey, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine(testHash, initialState, otherState, alternateStateKey);

      reducer(givenState, givenAction);

      expect(testHash[otherState]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });

    it('uses the reducer method associated with the current state', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);
      testHash[expectedState] = jest.fn();

      const reducer = createStateMachine(testHash);

      reducer(givenState, givenAction);

      expect(testHash[expectedState]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });

    it('uses traverseReducerArray if reducer method is an array', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);

      const expectedCallback = jest.fn();
      testHash[expectedState] = [expectedCallback];

      const reducer = createStateMachine(testHash);
      reducer(givenState, givenAction);

      expect(expectedCallback).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });
  });
});
