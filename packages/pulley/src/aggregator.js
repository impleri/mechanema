// @flow strict

import * as effects from 'redux-saga/effects';

/**
 * Internal registry to aggregate epics.
 */
const REGISTRY = [];

type EpicDef = {
  effect: Function | string,
  on: string,
  call: Function
};

type EpicMethod = () => Iterator<any>;

const DEFAULT_EFFECT = 'takeEvery';

/**
 * Create Root Epic
 *
 * Generates a root epic to initiate all registered epics.
 * @return {EpicMethod} Root epic function.
 */
export function createRootEpic(): EpicMethod {
  const epicMethods = REGISTRY.reduce(
    (accumulator, epic) => accumulator.concat(epic),
    [],
  ).map((epic: EpicDef) => function* epicWatcher(): any {
    let callEffect = epic.effect;

    if (typeof callEffect === 'string') {
      callEffect = effects[epic.effect];
    }

    if (!callEffect) {
      callEffect = effects[DEFAULT_EFFECT];
    }

    yield callEffect(epic.on, epic.call);
  });

  return function* rootEpic() {
    yield effects.all(epicMethods.map((epic: EpicMethod): any => epic()));
  };
}

/**
 * Register Epic
 *
 * Adds one or more epics at to the registry.
 * @param {EpicDef|EpicDef[]} epics Epic definitions (or single epic) to add
 *                                  to the registry.
 */
export function registerEpics(epics: EpicDef | EpicDef[]): void {
  REGISTRY.push(epics);
}
