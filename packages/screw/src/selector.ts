import { Collection, Map } from 'immutable';
import moize from 'moize';

export interface ISelector {
  (state: Collection<any, any>): any;
  isMoized?: boolean;
}

export interface IConstant {
  (): any;
  isMoized?: boolean;
}

export interface IAggregator {
  (...parameters: any): any;
}

export function getSlice(namespace: string): ISelector {
  return (state: Collection<any, any>): Map<any, any> => state.get(namespace, Map());
}

type selectorFnType = ISelector | IConstant
function createSimpleSelector(selectorFn: selectorFnType): ISelector {
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
  dependencies: selectorFnType[],
  aggregateFn: IAggregator,
): ISelector {
  // memoize all the dependency selectors
  const memoizedDeps = dependencies.map(createSimpleSelector);
  const memoizedAggregate = moize(aggregateFn);

  // Fake memoization for complex selectors
  return Object.assign(
    (state: Collection<any, any>): any => {
      const values = memoizedDeps.map(dependency => dependency(state));

      return memoizedAggregate(...values);
    },
    {
      isMoized: true,
    },
  );
}

export function createSelector(
  mixedParam: ISelector | selectorFnType[] | any,
  selectorFn?: ISelector,
): ISelector {
  let selector: ISelector = (): any => {};

  // Assume a complex selector if given an array
  if (Array.isArray(mixedParam)) {
    const aggregateFn = (typeof selectorFn === 'function') ? selectorFn : mixedParam.pop();
    const dependencies: selectorFnType[] = mixedParam;

    selector = createComplexSelector(
      dependencies,
      aggregateFn,
    );
  // If given two params, still a simple selector but on a slice
  } else if (typeof selectorFn === 'function' && typeof mixedParam === 'string') {
    selector = createComplexSelector([getSlice(mixedParam)], selectorFn);
  // If given anything else, should be a simple selector
  } else {
    selector = createSimpleSelector(mixedParam);
  }

  return selector;
}
