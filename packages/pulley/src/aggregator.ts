import {
  IEpic,
  IEpicFunction,
  IRootStrategy,
  IWatcherStrategy,
} from './types';
import { genericWatcher } from './watcher-strategies';
import { simpleRoot } from './root-strategies';

/**
 * Internal registry to aggregate epics.
 */
const REGISTRY: IEpic[] | IEpic[] = [];

/**
 * Create Root Epic
 *
 * Generates a root epic to initiate all registered epics.
 * @param {IRootStrategy} rootStrategy Strategy for generating root epi.
 * @param {IWatcherStrategy} watcherStrategy Strategy for generating watcher epics.
 * @return {IEpicFunction} Root epic function.
 */
export function createRootEpic(
  rootStrategy: IRootStrategy = simpleRoot,
  watcherStrategy: IWatcherStrategy = genericWatcher,
): IEpicFunction {
  const epicMethods = REGISTRY.map(watcherStrategy);

  return rootStrategy(epicMethods);
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
