// @flow strict

import { Map } from 'immutable';
import type { Collection } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { createStateMachine } from './state-machine';
import type { ReducerMethod, StateMachineHash } from './state-machine';

/**
 * Internal registry to aggregate reducers.
 */
const REGISTRY: {[namespace: string]: ReducerMethod} = {};

/**
 * Create Root Reducer
 *
 * Generates an Immutable-based reducer to inject into config.
 * @return {ReducerMethod} Root reducer function.
 */
export default function createRootReducer(): ReducerMethod {
  return combineReducers(REGISTRY);
}

/**
 * Register Reducer
 *
 * Adds a reducer at to the registry at the specified namespace key.
 * @param {string}   namespace Key to identify reducer slice for redux.
 * @param {function} reducerFn Reducer method to use ((state, action) => newState).
 * @throws {Error} If namespace key already exists in registry.
 */
export function registerReducer(namespace: string, reducerFn: ReducerMethod): void {
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
 * @param {Collection} initialState        Defined initial state for the
 *                                         reducer slice.
 * @return {function}  State machine Reducer function
 */
export function registerStateMachine(
  namespace: string,
  machineDefinition: StateMachineHash,
  initialState: Collection<any, any> = Map(),
): ReducerMethod {
  const stateMachine = createStateMachine(machineDefinition, initialState);

  registerReducer(namespace, stateMachine);

  return stateMachine;
}
