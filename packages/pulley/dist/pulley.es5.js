'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var effects = require('redux-saga/effects');

//  strict

/**
 * Internal registry to aggregate epics.
 */
const REGISTRY = [];



const DEFAULT_EFFECT = 'takeEvery';

/**
 * Create Root Epic
 *
 * Generates a root epic to initiate all registered epics.
 * @return {EpicMethod} Root epic function.
 */
function createRootEpic() {
  const epicMethods = REGISTRY.reduce(
    (accumulator, epic) => accumulator.concat(epic),
    [],
  ).map(epic => function* epicWatcher() {
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
    yield effects.all(epicMethods.map(epic => epic()));
  };
}

/**
 * Register Epic
 *
 * Adds one or more epics at to the registry.
 * @param {EpicDef|EpicDef[]} epics Epic definitions (or single epic) to add
 *                                  to the registry.
 */
function registerEpics(epics) {
  REGISTRY.push(epics);
}

exports.createRootEpic = createRootEpic;
exports.registerEpics = registerEpics;
