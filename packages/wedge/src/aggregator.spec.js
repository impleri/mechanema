import faker from 'faker';
import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import createRootReducer, { registerReducer, registerStateMachine } from './aggregator';
import { createStateMachine } from './state-machine';

jest.mock('redux-immutable');
jest.mock('./state-machine');

describe('aggregation functions', () => {
  describe('createRootReducer', () => {
    it('returns a root reducer method', () => {
      createRootReducer();
      expect(combineReducers).toBeCalledWith(expect.any(Object));
    });
  });

  describe('registerReducer', () => {
    it('adds a reducer method to the internal registry', () => {
      const givenReducer = jest.fn();
      const givenNamespace = faker.random.word();

      expect(() => {
        registerReducer(givenNamespace, givenReducer);
        createRootReducer();
      }).not.toThrow();

      expect(combineReducers).toBeCalledWith({
        [givenNamespace]: givenReducer,
      });
    });

    it('throws an error if trying overwrite an existing key', () => {
      const givenReducer = jest.fn();
      const givenNamespace = faker.random.word();

      expect(() => {
        registerReducer(givenNamespace, givenReducer);
        registerReducer(givenNamespace, givenReducer);
      }).toThrow(/namespace/i);
    });
  });

  describe('registerStateMachine', () => {
    it('creates the state machine and adds it to the internal registry', () => {
      const givenMachineHash = {
        [faker.random.word]: jest.fn(),
      };
      const givenNamespace = faker.random.word();

      const expectedReducer = jest.fn();

      createStateMachine.mockImplementation(() => expectedReducer);

      expect(() => {
        registerStateMachine(givenNamespace, givenMachineHash);
        createRootReducer();
      }).not.toThrow();

      expect(createStateMachine).toBeCalledWith(givenMachineHash);
      expect(combineReducers).toBeCalledWith(expect.objectContaining({
        [givenNamespace]: expectedReducer,
      }));
    });
  });
});
