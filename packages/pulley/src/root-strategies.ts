import {
  all,
  call,
  CallEffect,
  Effect,
  ForkEffect,
  spawn as spawnEffect,
} from 'redux-saga/effects';
import { IEpicFunction, SimpleStrategyEffect } from './types';

export function createEpicSpawn(epic: IEpicFunction): IEpicFunction<CallEffect> {
  return function* spawnEpic(): Iterator<CallEffect> {
    while (true) {
      try {
        yield call(epic);
        break;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };
}

export function spawnMapper(epic: IEpicFunction): ForkEffect {
  return spawnEffect(createEpicSpawn(epic));
}

/**
 * Initiate Epic
 *
 * A keepalive fork of the epic watcher so that all epics
 * continue to run.
 * @param {IEpicFunction} epic Epic Function
 */
export function spawnRoot(epicMethods: IEpicFunction[]): IEpicFunction<ForkEffect> {
  return function* rootEpic(): Iterator<ForkEffect> {
    yield* epicMethods.map(spawnMapper);
  };
}

export function simpleMapper(epic: IEpicFunction<Effect>): Iterator<Effect> {
  return epic();
}

export function simpleRoot(
  epicMethods: IEpicFunction<Effect>[],
): IEpicFunction<SimpleStrategyEffect> {
  return function* rootEpic(): Iterator<SimpleStrategyEffect> {
    yield all<Iterator<Effect>>(epicMethods.map(simpleMapper));
  };
}
