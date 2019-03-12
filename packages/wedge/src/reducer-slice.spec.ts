// eslint-disable-next-line import/no-extraneous-dependencies
import { Map } from 'immutable';

import { createReducer, IReducerSlice } from './reducer-slice';

import faker = require('faker');


describe('reducer slice functions', () => {
  describe('createReducer', () => {
    it('returns a reducer method', () => {
      const expectedAction = faker.hacker.noun();
      const callback = jest.fn();

      expect(createReducer(expectedAction, callback)).toEqual(expect.any(Function));
    });
  });

  describe('createReducer reducer', () => {
    it('does nothing on the wrong action', () => {
      const expectedAction = faker.hacker.noun();
      const callback = jest.fn();
      const reducerFn = createReducer(expectedAction, callback);

      const givenAction = {
        type: faker.hacker.verb(),
        payload: {
          [faker.company.bsBuzz()]: faker.company.catchPhrase(),
        },
      };
      const givenState = Map({
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

    it('triggers the callback on the right action', () => {
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

      const callback: IReducerSlice = (state, payload): Map<any, any> => state.setIn(
        [mapKey, newKey],
        payload[valueKey],
      );
      const reducerFn = createReducer(expectedAction, callback);

      const givenState = Map({
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

    it('triggers the callback on the right action with the whole action', () => {
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

      const callback: IReducerSlice = (state, payload): Map<any, any> => state.setIn(
        [mapKey, newKey],
        payload[valueKey],
      );
      const reducerFn = createReducer(expectedAction, callback);

      const givenState = Map({
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