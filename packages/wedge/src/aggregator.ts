import { RecordOf } from 'immutable';
import { Reducer } from 'redux';
import { combineReducers } from 'redux-immutable';

import { createStateMachine, IStateMachine, IStateMachineHash } from './state-machine';

interface IRegistry {
  [namespace: string]: Reducer;
}

/**
 * Internal registry to aggregate reducers.
 */
const REGISTRY: IRegistry = {};

/**
 * Create Root Reducer
 *
 * Generates an Immutable-based reducer to inject into config.
 * @return {Reducer} Root reducer function.
 */
export function createRootReducer(): Reducer {
  return combineReducers(REGISTRY);
}

/**
 * Register Reducer
 *
 * Adds a reducer at to the registry at the specified namespace key.
 * @param {string}  namespace Key to identify reducer slice for redux.
 * @param {Reducer} reducerFn Reducer method to use ((state, action) => newState).
 * @throws {Error}  If namespace key already exists in registry.
 */
export function registerReducer(namespace: string, reducerFn: Reducer): void {
  if (Object.prototype.hasOwnProperty.call(REGISTRY, namespace)) {
    throw new Error('Namespace already registed for the store.');
  }

  REGISTRY[namespace] = reducerFn;
}

/**
 * Register State Machine
 *
 * Adds a state machine reducer to the registry at the specified namespace key.
 * @param {string}     namespace           Key to identify reducer slice for redux.
 * @param {object}     machineDefinition   State Machine definition to use.
 * @param {RecordOf}   initialState        Defined initial state for the
 *                                         reducer slice.
 * @return {Reducer}  State machine Reducer function
 */
export function registerStateMachine<S = IStateMachine>(
  namespace: string,
  machineDefinition: IStateMachineHash,
  initialState?: RecordOf<S>,
): Reducer {
  const stateMachine = createStateMachine<S>(machineDefinition, initialState);

  registerReducer(namespace, stateMachine);

  return stateMachine;
}
