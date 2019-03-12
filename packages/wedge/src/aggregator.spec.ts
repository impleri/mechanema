// eslint-disable-next-line import/no-extraneous-dependencies
import { Collection } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { createRootReducer, registerReducer, registerStateMachine } from './aggregator';
import { createStateMachine } from './state-machine';

import faker = require('faker');

jest.mock('redux-immutable');
jest.mock('./state-machine');

describe('aggregation functions', () => {
  describe('createRootReducer', () => {
    it('returns a root reducer method', () => {
      createRootReducer();
      expect(combineReducers).toHaveBeenCalledWith(expect.any(Object));
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

      expect(combineReducers).toHaveBeenCalledWith({
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
        [faker.random.word()]: jest.fn(),
      };
      const givenNamespace = faker.random.word();

      const expectedReducer = jest.fn();

      (createStateMachine as jest.Mock).mockImplementation(() => expectedReducer);

      expect(() => {
        registerStateMachine(givenNamespace, givenMachineHash);
        createRootReducer();
      }).not.toThrow();

      expect(createStateMachine).toHaveBeenCalledWith(givenMachineHash, expect.any(Collection));
      expect(combineReducers).toHaveBeenCalledWith(expect.objectContaining({
        [givenNamespace]: expectedReducer,
      }));
    });
  });
});