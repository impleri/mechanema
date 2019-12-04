// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';
import { combineReducers } from 'redux-immutable';

import { createRootReducer, registerReducer, registerStateMachine } from './aggregator';
import { createStateMachine } from './state-machine';

jest.mock('redux-immutable');
jest.mock('./state-machine');

describe('aggregation functions', (): void => {
  describe('createRootReducer', (): void => {
    it('returns a root reducer method', (): void => {
      createRootReducer();
      expect(combineReducers).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('registerReducer', (): void => {
    it('adds a reducer method to the internal registry', (): void => {
      const givenReducer = jest.fn();
      const givenNamespace = faker.random.word();

      expect((): void => {
        registerReducer(givenNamespace, givenReducer);
        createRootReducer();
      }).not.toThrow();

      expect(combineReducers).toHaveBeenCalledWith({
        [givenNamespace]: givenReducer,
      });
    });

    it('throws an error if trying overwrite an existing key', (): void => {
      const givenReducer = jest.fn();
      const givenNamespace = faker.random.word();

      expect((): void => {
        registerReducer(givenNamespace, givenReducer);
        registerReducer(givenNamespace, givenReducer);
      }).toThrow(/namespace/i);
    });
  });

  describe('registerStateMachine', (): void => {
    it('creates the state machine and adds it to the internal registry', (): void => {
      const givenMachineHash = {
        [faker.random.word()]: jest.fn(),
      };
      const givenNamespace = faker.random.word();

      const expectedReducer = jest.fn();

      (createStateMachine as jest.Mock).mockImplementation(() => expectedReducer);

      expect((): void => {
        registerStateMachine(givenNamespace, givenMachineHash);
        createRootReducer();
      }).not.toThrow();

      expect(createStateMachine).toHaveBeenCalledWith(givenMachineHash, undefined);
      expect(combineReducers).toHaveBeenCalledWith(expect.objectContaining({
        [givenNamespace]: expectedReducer,
      }));
    });
  });
});
