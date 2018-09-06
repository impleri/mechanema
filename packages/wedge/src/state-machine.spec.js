import faker from 'faker';
import { List, Map } from 'immutable';

import {
  createStateMachine,
  INIT,
  KEY_STATE,
  traverseReducerArray,
} from './state-machine';

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
    it('uses the default reducer method if current state is not matched', () => { });
    it('uses the reducer method associated with the current state', () => { });
    it('uses traverseReducerArray if reducer method is an array', () => { });
  });
});
