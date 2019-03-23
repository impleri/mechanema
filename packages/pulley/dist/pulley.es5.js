'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var effects = require('redux-saga/effects');

const REGISTRY = [];
const DEFAULT_EFFECT = 'takeEvery';
function mapEpicToFunction(epic) {
    return function* epicWatcher() {
        let callEffect = effects[DEFAULT_EFFECT];
        if (typeof epic.effect === 'string' && Object.keys(effects).includes(epic.effect)) {
            callEffect = effects[epic.effect];
        }
        if (typeof epic.effect === 'function') {
            callEffect = epic.effect;
        }
        yield callEffect(epic.on, epic.call);
    };
}
function initiateEpic(epic) {
    effects.spawn(function* spawnEpic() {
        while (true) {
            try {
                yield effects.call(epic);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
function createRootEpic() {
    const epicMethods = REGISTRY.map(mapEpicToFunction);
    return function* rootEpic() {
        yield* epicMethods.map(initiateEpic);
    };
}
function registerEpic(epic) {
    REGISTRY.push(epic);
}
function registerEpics(epics, ...additionalEpics) {
    let realEpics = (Array.isArray(epics)) ? epics : [epics];
    realEpics = realEpics.concat(additionalEpics);
    realEpics.forEach(registerEpic);
}
function resetRegistry() {
    REGISTRY.length = 0;
}

exports.createRootEpic = createRootEpic;
exports.registerEpic = registerEpic;
exports.registerEpics = registerEpics;
exports.resetRegistry = resetRegistry;
