import { Map } from 'immutable';
import moize from 'moize';
import { INIT, KEY_STATE } from '@mechanema/wedge';

//  strict




function bindSelector(
  selector,
  state,
) {
  return selector(state);
}

function bindSelectors(
  selectors,
  state,
) {
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

//  strict


function getSlice(namespace) {
  return (state) => state.get(namespace, Map());
}

function createSimpleSelector(selectorFn) {
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
  dependencies,
  aggregateFn,
) {
  // memoize all the dependency selectors
  const memoizedDeps = dependencies.map(createSimpleSelector);
  const memoizedAggregage = createSimpleSelector(aggregateFn);

  // Fake memoization for complex selectors
  return Object.assign(
    (state) => {
      const values = memoizedDeps.map(dependency => dependency(state));

      return memoizedAggregage(...values);
    },
    {
      isMoized: true,
    },
  );
}

function createSelector(
  mixedParam,
  selectorFn,
) {
  let selector = () => {};

  // Assume a complex selector if given an array
  if (Array.isArray(mixedParam)) {
    const aggregateFn = (typeof selectorFn === 'function') ? selectorFn : mixedParam.pop();
    const dependencies = mixedParam;

    selector = createComplexSelector(
      (dependencies),
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

//  strict

function getStateSelector(
  namespace,
  stateKey = KEY_STATE,
  initState = INIT,
) {
  return createSelector(
    namespace,
    (sliceState) => sliceState.get(stateKey, initState),
  );
}

export { bindSelectors, getStateSelector, createSelector, getSlice };
