import { Collection } from 'immutable';
import { ISelector } from './selector';

export interface ISelectorHash {
  [key: string]: ISelector;
}

export interface IBoundSelectorHash {
  [key: string]: any;
}

export function bindStateToSelector<T extends IBoundSelectorHash, S extends Collection<any, any>>(
  selector: ISelector<T, S>,
  state: S,
): T {
  return selector(state);
}

export function bindStateToSelectors<T extends IBoundSelectorHash, S extends Collection<any, any>>(
  selectors: ISelector<T, S> | ISelectorHash,
  state: S,
): T {
  if (typeof selectors === 'function') {
    return bindStateToSelector(selectors, state);
  }

  return Object.keys(selectors).reduce(
    (aggregator: T, selectorKey: string): T => {
      const newAggregator = { ...aggregator };
      const selector = selectors[selectorKey];

      (newAggregator as IBoundSelectorHash)[selectorKey] = selector;

      if (typeof selector === 'function') {
        (newAggregator as IBoundSelectorHash)[selectorKey] = bindStateToSelector(selector, state);
      }

      return newAggregator;
    },
    {} as unknown as T,
  );
}
