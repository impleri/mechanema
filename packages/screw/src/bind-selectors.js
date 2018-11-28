// @flow strict

import type { Collection } from 'immutable';

type SelectorHash = {
  [key: string]: Function
};

type BoundSelectorHash = {
  [key: string]: any
};

export function bindSelector(
  selector: Function,
  state: Collection<any, any>,
): any {
  return selector(state);
}

export default function bindSelectors(
  selectors: Function | SelectorHash,
  state: Collection<any, any>,
): BoundSelectorHash {
  if (typeof selectors === 'function') {
    return bindSelector(selectors, state);
  }

  if (typeof selectors !== 'object' || selectors === null) {
    throw new Error(`bindSelectors expected an object or a function,
      instead received ${(selectors === null) ? 'null' : typeof selectors}.`);
  }

  return Object.keys(selectors).reduce((aggregator, selectorKey) => {
    const newAggregator = aggregator;
    const selector = selectors[selectorKey];

    if (typeof selector === 'function') {
      newAggregator[selectorKey] = bindSelector(selector, state);
    }

    return newAggregator;
  }, {});
}
