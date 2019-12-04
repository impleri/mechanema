import { Collection } from 'immutable';
import moize from 'moize';

export interface ISelector<Value = any, State = any> {
  (state: State): Value;
  isMoized?: boolean;
}

export interface IConstant<Value = string> {
  (): Value;
  isMoized?: boolean;
}

export interface IAggregator<Value = any> {
  (...parameters: any[]): Value;
}

type selectorFnType<Value = any, State = any> = ISelector<Value, State> | IConstant<Value>

/**
 * Get Slice
 * Return reducer slice from overall store.
 * @param namespace Index name of reducer slice
 * @return Reducer slice
 */
export function getSlice<State = any, NamespaceId = string | symbol>(
  namespace: NamespaceId,
): ISelector<State, Collection<NamespaceId, State>> {
  return (state: Collection<NamespaceId, State>): State => state.get(namespace) as State;
}

function createSimpleSelector<Value = any, State = any>(
  selectorFn: selectorFnType<Value, State>,
): ISelector<Value, State> {
  if (typeof selectorFn === 'function') {
    // Already memoized
    if (selectorFn.isMoized) {
      return selectorFn;
    }

    return moize(selectorFn);
  }

  // Convert non-function selectors into static functions
  return moize.maxArgs(0)((): ISelector<Value, State> => selectorFn);
}

function createComplexSelector<Value = any, State = any, Params = any[]>(
  dependencies: selectorFnType<Params, State>[],
  aggregateFn: IAggregator<Value>,
): ISelector<Value, State> {
  // memoize all the dependency selectors
  const memoizedDeps = dependencies.map(createSimpleSelector);
  const memoizedAggregate = moize(aggregateFn);

  // Fake memoization for complex selectors
  return Object.assign(
    (state: State): Value => {
      const aggregatorParams: Params[] = memoizedDeps.map(
        (dependency): Params => dependency(state),
      );

      return memoizedAggregate(...aggregatorParams);
    },
    {
      isMoized: true,
    },
  );
}

export function createSelector<Value = any, State = any, Params = any>(
  mixedParam: selectorFnType<Value, State>
  | selectorFnType<Value, State
  | Params>[]
  | string
  | symbol
  | keyof State,
  selectorFn?: selectorFnType<Value, Params>,
): ISelector<Value, State> {
  let selector: ISelector = (): void => undefined;

  // Assume a complex selector if given an array
  if (Array.isArray(mixedParam)) {
    const aggregateFn: IAggregator<Value> = (typeof selectorFn === 'function')
      ? selectorFn as IAggregator<Value>
      : mixedParam.pop() as IAggregator<Value>;
    const dependencies = mixedParam as unknown as selectorFnType<Params, State>[];

    selector = createComplexSelector<Value, State, Params>(
      dependencies,
      aggregateFn as IAggregator<Value>,
    );
  // If given two params, still a simple selector but on a slice
  } else if (typeof selectorFn === 'function' && typeof mixedParam === 'string') {
    selector = createComplexSelector<Value, State, Params>(
      [getSlice(mixedParam) as selectorFnType<Params, State>],
      selectorFn as IAggregator<Value>,
    );
  // If given anything else, should be a simple selector
  } else {
    selector = createSimpleSelector<Value, State>(mixedParam as selectorFnType<Value, State>);
  }

  return selector;
}
