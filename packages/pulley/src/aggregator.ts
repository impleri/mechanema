import * as effects from 'redux-saga/effects';

export interface IEpic {
  effect: Function | string;
  on: string;
  call: Function;
}

export interface IEpicFunction {
  (): Iterator<void>;
}

/**
 * Internal registry to aggregate epics.
 */
const REGISTRY: IEpic[] | IEpic[] = [];

/**
 * Default effect
 */
const DEFAULT_EFFECT = 'takeEvery';

/**
 * Map Epic To Function
 *
 * Map method for converting the basic epic definition to a generator function.
 * @param  {IEpic}    epic Epic definition
 * @return {IEpicFunction} Epic function
 */
function mapEpicToFunction(epic: IEpic): IEpicFunction {
  return function* epicWatcher(): Iterator<void> {
    let callEffect: Function = effects[DEFAULT_EFFECT];

    if (typeof epic.effect === 'string' && Object.keys(effects).includes(epic.effect)) {
      callEffect = (effects as any)[epic.effect];
    }

    if (typeof epic.effect === 'function') {
      callEffect = epic.effect;
    }

    yield callEffect(epic.on, epic.call);
  };
}

/**
 * Initiate Epic
 *
 * A keepalive fork of the epic watcher so that all epics
 * continue to run.
 * @param {IEpicFunction} epic Epic Function
 */
function initiateEpic(epic: IEpicFunction): void {
  effects.spawn(function* spawnEpic() {
    while (true) {
      try {
        yield effects.call(epic);
        break;
      } catch (error) {
        console.error(error);
      }
    }
  });
}

/**
 * Create Root Epic
 *
 * Generates a root epic to initiate all registered epics.
 * @return {IEpicFunction} Root epic function.
 */
export function createRootEpic(): IEpicFunction {
  const epicMethods = REGISTRY.map(mapEpicToFunction);

  return function* rootEpic(): Iterator<void> {
    yield* epicMethods.map(initiateEpic);
  };
}

/**
 * Register Epic
 *
 * Adds an epic to the registry.
 * @param {IEpic} epic Epic definition to add to the registry.
 */
export function registerEpic(epic: IEpic): void {
  REGISTRY.push(epic);
}

/**
 * Register Epics
 *
 * Adds one or more epics at to the registry.
 * @param {IEpic[]} epics Epic definition(s) to add to the registry.
 */
export function registerEpics(epics: IEpic|IEpic[], ...additionalEpics: IEpic[]): void {
  let realEpics: IEpic[] = (Array.isArray(epics)) ? epics : [epics];
  realEpics = realEpics.concat(additionalEpics);

  realEpics.forEach(registerEpic);
}

/**
 * Reset Registry
 *
 * Truncate the registry.
 * @private
 */
export function resetRegistry(): void {
  REGISTRY.length = 0;
}
