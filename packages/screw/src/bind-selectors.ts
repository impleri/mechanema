import { Map } from 'immutable';
import { ISelector } from './selector';

export interface ISelectorHash {
  [key: string]: ISelector;
}

export interface IBoundSelectorHash {
  [key: string]: any;
}

export function bindStateToSelector<T>(
  selector: ISelector,
  state: Map<any, any>,
): T {
  return selector(state);
}

export function bindStateToSelectors(
  selectors: ISelector | ISelectorHash,
  state: Map<any, any>,
): IBoundSelectorHash | any {
  if (typeof selectors === 'function') {
    return bindStateToSelector(selectors, state);
  }

  return Object.keys(selectors).reduce(
    (aggregator: IBoundSelectorHash, selectorKey: string): IBoundSelectorHash => {
      const newAggregator = aggregator;
      const selector = selectors[selectorKey];

      newAggregator[selectorKey] = selector;

      if (typeof selector === 'function') {
        newAggregator[selectorKey] = bindStateToSelector(selector, state);
      }

      return newAggregator;
    },
    {},
  );
}
