// @flow strict

import { Collection, Map } from 'immutable';
import moize from 'moize';

export type SelectorMethod = (state: Collection<any, any>) => any;
type ConstantMethod = () => any;
type AggregatorMethod = (...parameters: any) => any;

export function getSlice(namespace: string): SelectorMethod {
  return (state: Collection<any, any>): Collection<any, any> => state.get(namespace, Map());
}

function createSimpleSelector(selectorFn: SelectorMethod | ConstantMethod): SelectorMethod {
  if (typeof selectorFn === 'function') {
    // Already memoized
    if (selectorFn.isMoized) {
      return selectorFn;
    }

    return moize(selectorFn);
  }

  // Convert non-function selectors into static functions
  return moize.maxArgs(0)(() => selectorFn);
}

function createComplexSelector(
  dependencies: Array<SelectorMethod | ConstantMethod>,
  aggregateFn: AggregatorMethod,
): SelectorMethod {
  // memoize all the dependency selectors
  const memoizedDeps = dependencies.map(createSimpleSelector);
  const memoizedAggregage = createSimpleSelector(aggregateFn);

  // Fake memoization for complex selectors
  return Object.assign(
    (state: Collection<any, any>): any => {
      const values = memoizedDeps.map(dependency => dependency(state));

      return memoizedAggregage(...values);
    },
    {
      isMoized: true,
    },
  );
}

export default function createSelector(
  mixedParam: SelectorMethod | Array<SelectorMethod | ConstantMethod> | string,
  selectorFn?: SelectorMethod,
): SelectorMethod {
  let selector = () => {};

  // Assume a complex selector if given an array
  if (Array.isArray(mixedParam)) {
    const aggregateFn = (typeof selectorFn === 'function') ? selectorFn : mixedParam.pop();
    const dependencies = mixedParam;

    selector = createComplexSelector(
      (dependencies: Array<SelectorMethod | ConstantMethod>),
      aggregateFn,
    );
  // If given two params, still a simple selector but on a slice
  } else if (typeof mixedParam === 'string') {
    if (typeof selectorFn === 'function') {
      selector = createComplexSelector([getSlice(mixedParam)], selectorFn);
    } else {
      selector = createSimpleSelector((): string => mixedParam);
    }
  // If given a function, should be a simple selector
  } else {
    selector = createSimpleSelector(mixedParam);
  }

  return selector;
}
