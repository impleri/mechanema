// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';
import { Record, RecordOf } from 'immutable';

import { createReducer, IReducerSlice } from './reducer-slice';

describe('reducer slice functions', (): void => {
  interface IStateMachine {
    machineState: string | symbol;
  }

  const stateShape: IStateMachine = {
    machineState: 'INIT',
  };

  const stateFactory = Record(stateShape);

  describe('createReducer', (): void => {
    it('returns a reducer method', (): void => {
      const expectedAction = faker.hacker.noun();
      const callback = jest.fn();

      expect(createReducer(expectedAction, callback)).toEqual(expect.any(Function));
    });
  });

  describe('createReducer reducer', (): void => {
    it('does nothing on the wrong action', (): void => {
      const expectedAction = faker.hacker.noun();
      const callback = jest.fn();
      const reducerFn = createReducer(expectedAction, callback);

      const givenAction = {
        type: faker.hacker.verb(),
        payload: {
          [faker.company.bsBuzz()]: faker.company.catchPhrase(),
        },
      };
      const givenState = stateFactory({
        [faker.lorem.word()]: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ],
        [faker.lorem.word()]: {
          [faker.lorem.slug()]: faker.lorem.paragraph(),
          [faker.lorem.slug()]: faker.lorem.paragraphs(),
        },
      });

      expect(reducerFn(givenState, givenAction)).toEqual(givenState);
    });

    it('triggers the callback on the right action', (): void => {
      const expectedAction = faker.hacker.noun();

      const listKey = faker.lorem.word();
      const mapKey = faker.lorem.word();
      const newKey = faker.lorem.word();

      const valueKey = faker.lorem.word();
      const value = faker.hacker.phrase();
      const givenAction = {
        type: expectedAction,
        payload: {
          [valueKey]: value,
        },
      };

      const callback: IReducerSlice<IStateMachine> = (
        state,
        payload,
      ): RecordOf<IStateMachine> => (state as RecordOf<IStateMachine>).setIn(
        [mapKey, newKey],
        payload[valueKey],
      );
      const reducerFn = createReducer(expectedAction, callback);

      const givenState = stateFactory({
        [listKey]: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ],
        [mapKey]: {
          [faker.lorem.slug()]: faker.lorem.paragraph(),
          [faker.lorem.slug()]: faker.lorem.paragraphs(),
        },
      });

      const expectedState = givenState.setIn([mapKey, newKey], value);

      expect(reducerFn(givenState, givenAction)).toEqual(expectedState);
    });

    it('triggers the callback on the right action with the whole action', (): void => {
      const expectedAction = faker.hacker.noun();

      const listKey = faker.lorem.word();
      const mapKey = faker.lorem.word();
      const newKey = faker.lorem.word();

      const valueKey = faker.lorem.word();
      const value = faker.hacker.phrase();
      const givenAction = {
        type: expectedAction,
        [valueKey]: value,
      };

      const callback: IReducerSlice<IStateMachine> = (
        state,
        payload,
      ): RecordOf<IStateMachine> => (state as RecordOf<IStateMachine>).setIn(
        [mapKey, newKey],
        payload[valueKey],
      );
      const reducerFn = createReducer(expectedAction, callback);

      const givenState = stateFactory({
        [listKey]: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ],
        [mapKey]: {
          [faker.lorem.slug()]: faker.lorem.paragraph(),
          [faker.lorem.slug()]: faker.lorem.paragraphs(),
        },
      });

      const expectedState = givenState.setIn([mapKey, newKey], value);

      expect(reducerFn(givenState, givenAction)).toEqual(expectedState);
    });
  });
});
