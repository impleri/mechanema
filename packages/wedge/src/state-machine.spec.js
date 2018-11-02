// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import { List, Map } from 'immutable';

const {
  createStateMachine,
  INIT,
  KEY_STATE,
  traverseReducerArray,
} = require('./state-machine');

describe('state machine functions', () => {
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

      const expectedState = initialState.mergeDeep(Map({
        [KEY_STATE]: newState,
        [listKey]: List(firstAdditions),
        [anotherKey]: anotherValue,
      }));

      const reducers = [
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
              [KEY_STATE]: faker.business.name(),
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
    let testHash;
    let givenState = Map();
    let givenAction;
    const initialState = Map({
      [faker.random.word()]: faker.lorem.paragraph(),
    });

    beforeEach(() => {
      givenState = Map();

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

      const expectedState = Map();

      const reducer = createStateMachine(testHash);

      const receivedState = reducer();

      expect(testHash[INIT]).toBeCalledWith(expectedState, undefined);
      expect(testHash[otherState]).not.toBeCalled();
      expect(receivedState.equals(expectedState)).toBe(true);
    });

    it('returns the given initial state if none provided', () => {
      const otherState = faker.random.word();
      testHash[otherState] = jest.fn(state => state);

      const reducer = createStateMachine(testHash, initialState);

      const receivedState = reducer();

      expect(testHash[INIT]).toBeCalledWith(initialState, undefined);
      expect(testHash[otherState]).not.toBeCalled();
      expect(receivedState.equals(initialState)).toBe(true);
    });

    it('uses the default reducer method if current state is not matched', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine(testHash);

      reducer(givenState, givenAction);

      expect(testHash[INIT]).toBeCalledWith(givenState, givenAction);
      expect(testHash[otherState]).not.toBeCalled();
    });

    it('uses the given fallback reducer method if given state property is not matched', () => {
      const alternateStateKey = faker.random.word();

      const expectedState = faker.hacker.noun();
      givenState = givenState.set(alternateStateKey, expectedState);

      const otherState = faker.random.word();
      testHash[otherState] = jest.fn();

      const reducer = createStateMachine(testHash, initialState, otherState, alternateStateKey);

      reducer(givenState, givenAction);

      expect(testHash[otherState]).toBeCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toBeCalled();
    });

    it('uses the reducer method associated with the current state', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);
      testHash[expectedState] = jest.fn();

      const reducer = createStateMachine(testHash);

      reducer(givenState, givenAction);

      expect(testHash[expectedState]).toBeCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toBeCalled();
    });


    it('uses traverseReducerArray if reducer method is an array', () => {
      const expectedState = faker.hacker.noun();
      givenState = givenState.set(KEY_STATE, expectedState);

      const expectedCallback = jest.fn();
      testHash[expectedState] = [expectedCallback];

      const reducer = createStateMachine(testHash);
      reducer(givenState, givenAction);

      expect(expectedCallback).toBeCalledWith(givenState, givenAction);
      expect(testHash[INIT]).not.toBeCalled();
    });
  });
});
