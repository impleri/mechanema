import { Record, RecordOf } from 'immutable';
import { Action, Reducer } from 'redux';

/**
 * The predefined initial/fallback state
 */
export const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
 * @deprecated
 */
export const KEY_STATE = 'machineState';

export interface IStateMachineHash {
  [state: string]: Reducer | Reducer[];
}

export interface IStateMachine {
  machineState: string | symbol;
}

export const stateShape: IStateMachine = {
  [KEY_STATE]: INIT,
};
const stateFactory = Record(stateShape);
const stateRecord: RecordOf<IStateMachine> = stateFactory();

/**
 * Traverse Reducer Array
 *
 * Iterates over an array of reducer slice methods to generate a single change
 * of state in redux store.
 * @param {Array<Reducer>} reducerArray Array of reducer methods (generally
 *                                      created via createReducer from
 *                                      `./reducer-slide`).
 * @return {Reducer}       Standard reducer function.
 */
export function traverseReducerArray<S = RecordOf<IStateMachine>>(
  reducerArray: Reducer[],
): Reducer {
  return (state: S, action): S => reducerArray.reduce(
    (newState: S, reducerCallback): S => reducerCallback(newState, action),
    state,
  );
}

/**
 * Create State Machine
 *
 * Translates a Hashmap of state-based reducer into a standard reducer function.
 * @param {object} machineHash         Hashmap of (state => reducer).
 * @param {Record} initialState        Defined initial state for the
 *                                     reducer slice.
 * @param {string} initialMachineState Value for the initial/fallback state.
 */
export function createStateMachine<S = IStateMachine>(
  machineHash: IStateMachineHash,
  initialState?: RecordOf<S>,
  initialMachineState: string = INIT,
): Reducer<RecordOf<S>> {
  let baseState = initialState || stateRecord;

  if (initialMachineState !== INIT) {
    const customState = {
      machineState: initialMachineState,
    };
    baseState = stateFactory(customState);
  }

  return (state = baseState as RecordOf<S>, action: Action): RecordOf<S> => {
    const currentState = state.get(KEY_STATE, initialMachineState);

    let reducerCallback: Reducer | Reducer[] = machineHash[initialMachineState];
    if (currentState && machineHash[currentState]) {
      reducerCallback = machineHash[currentState];
    }

    if (Array.isArray(reducerCallback)) {
      reducerCallback = traverseReducerArray(reducerCallback);
    }

    return reducerCallback(state, action);
  };
}

type IChangeState<S extends IStateMachine> = (state: RecordOf<S>) => RecordOf <S>;

export function changeStateTo<S extends IStateMachine>(
  newState: string | symbol,
): IChangeState<S> {
  return (
    state: RecordOf<S>,
  ): RecordOf<S> => state.set(KEY_STATE, newState);
}

export function changeState<S extends IStateMachine>(
  state: RecordOf<S>,
  newState: string | symbol,
): RecordOf<S> {
  return changeStateTo<S>(newState)(state);
}
