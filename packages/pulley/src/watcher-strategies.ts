import * as effects from 'redux-saga/effects';
import { IEpic, IEpicFunction } from './types';

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
// eslint-disable-next-line import/prefer-default-export
export function genericWatcher(epic: IEpic): IEpicFunction<effects.Effect> {
  return function* epicWatcher(): Iterator<effects.Effect> {
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
