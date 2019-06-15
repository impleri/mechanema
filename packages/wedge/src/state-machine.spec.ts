import {
  fromJS,
  List,
  Record,
  RecordOf,
} from 'immutable';
import { Action, Reducer } from 'redux';

import {
  changeState,
  createStateMachine,
  INIT,
  KEY_STATE,
  IStateMachine,
  IStateMachineHash,
  traverseReducerArray,
} from './state-machine';

import faker = require('faker');

describe('state machine functions', (): void => {
  beforeEach((): void => {
    jest.resetAllMocks();
  });

  describe('Initial constants', (): void => {
    it('are exported', (): void => {
      expect(`${INIT}`.length).toBeGreaterThan(0);
      expect(`${KEY_STATE}`.length).toBeGreaterThan(0);
    });
  });

  describe('traverseReducerArray', (): void => {
    it('returns an iterator for reducer slice methods', (): void => {
      const anotherValue = faker.random.number();
      const expectedAction = faker.hacker.verb();
      const newState = faker.hacker.noun();

      interface ITest extends IStateMachine {
        list?: List<string>;
        other?: number;
      }

      const stateShape: ITest = {
        [KEY_STATE]: INIT,
      };

      const stateFactory = Record(stateShape);

      const initialState = stateFactory().set('list', List([
        faker.lorem.sentence(),
      ]));

      const firstAdditions = [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ];

      const expectedState = initialState.mergeDeep(fromJS({
        [KEY_STATE]: newState,
        list: List(firstAdditions),
        other: anotherValue,
      }));

      const reducers: Reducer[] = [
        (state, action): void => {
          if (action.type === expectedAction) {
            return state.mergeDeep({
              [KEY_STATE]: newState,
              list: List(firstAdditions),
            });
          }

          return state;
        },
        (state, action): void => {
          if (action.type === faker.lorem.slug()) {
            return state.merge({
              [KEY_STATE]: faker.random.words(),
              list: List([]),
            });
          }

          return state;
        },
        (state, action): void => {
          if (action.type === expectedAction) {
            return state.merge({
              other: anotherValue,
            });
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

  describe('createStateMachine', (): void => {
    let testHash: IStateMachineHash;
    let givenAction: Action;
    interface ITestState extends IStateMachine {
      [index: string]: string | symbol;
    }
    let givenState: RecordOf<ITestState>;
    const stateValue = {
      [KEY_STATE]: INIT,
      [faker.random.word()]: faker.lorem.paragraph(),
    };
    const stateRecord = Record<ITestState>(stateValue as ITestState);
    const initialState = stateRecord();

    beforeEach((): void => {
      jest.resetAllMocks();

      givenState = stateRecord({
        [faker.random.word()]: faker.random.words(),
      });

      givenAction = {
        type: faker.random.word(),
      };

      testHash = {
        [INIT]: jest.fn(state => state),
      };
    });

    it('returns the default state if none provided', (): void => {
      const otherState = faker.random.word();
      testHash[otherState] = jest.fn(state => state);

      const reducer = createStateMachine<ITestState>(testHash);

      const receivedState = reducer(initialState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(initialState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
      expect(receivedState.equals(initialState)).toBe(true);
    });

    it('returns the given initial state if none provided', (): void => {
      const otherState = faker.random.word();
      testHash[otherState] = jest.fn(state => state);

      const reducer = createStateMachine<ITestState>(testHash, initialState);

      const receivedState = reducer(initialState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(initialState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
      expect(receivedState.equals(initialState)).toBe(true);
    });

    it('uses the default reducer method if current state is not matched', (): void => {
      const expectedState = faker.hacker.noun();
      givenState = changeState(givenState, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine<ITestState>(testHash);

      reducer(givenState, givenAction);

      expect(testHash[INIT]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[otherState]).not.toHaveBeenCalled();
    });

    it('uses the given fallback reducer method if given state property is not matched', (): void => {
      const expectedState = faker.hacker.noun();
      givenState = changeState(givenState, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine<ITestState>(testHash, initialState, otherState);

      reducer(givenState, givenAction);

      expect(testHash[otherState]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });

    it('uses the reducer method associated with the current state', (): void => {
      const expectedState = faker.hacker.noun();
      givenState = changeState(givenState, expectedState);
      testHash[expectedState] = jest.fn(state => state);

      const reducer = createStateMachine<ITestState>(testHash);

      reducer(givenState, givenAction);

      expect(testHash[expectedState]).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });

    it('uses traverseReducerArray if reducer method is an array', (): void => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);

      const expectedCallback = jest.fn(state => state);
      testHash[expectedState] = [expectedCallback];

      const reducer = createStateMachine<ITestState>(testHash);
      reducer(givenState, givenAction);

      expect(expectedCallback).toHaveBeenCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toHaveBeenCalled();
    });
  });
});
