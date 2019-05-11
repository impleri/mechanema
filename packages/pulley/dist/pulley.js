import * as effects from 'redux-saga/effects';
import { call, spawn, all } from 'redux-saga/effects';

const DEFAULT_EFFECT = 'takeEvery';
function genericWatcher(epic) {
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

function createEpicSpawn(epic) {
    return function* spawnEpic() {
        while (true) {
            try {
                yield call(epic);
                break;
            }
            catch (error) {
                console.error(error);
            }
        }
    };
}
function spawnMapper(epic) {
    return spawn(createEpicSpawn(epic));
}
function spawnRoot(epicMethods) {
    return function* rootEpic() {
        yield* epicMethods.map(spawnMapper);
    };
}
function simpleMapper(epic) {
    return epic();
}
function simpleRoot(epicMethods) {
    return function* rootEpic() {
        yield all(epicMethods.map(simpleMapper));
    };
}

const REGISTRY = [];
function createRootEpic(rootStrategy = simpleRoot, watcherStrategy = genericWatcher) {
    const epicMethods = REGISTRY.map(watcherStrategy);
    return rootStrategy(epicMethods);
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

export { createEpicSpawn, createRootEpic, genericWatcher, registerEpic, registerEpics, resetRegistry, simpleMapper, simpleRoot, spawnMapper, spawnRoot };
