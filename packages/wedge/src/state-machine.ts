import { Record, RecordOf } from 'immutable';
import { Action, AnyAction, Reducer } from 'redux';

/**
 * The predefined initial/fallback state
 */
export const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
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

export const stateFactory = Record(stateShape);
const stateRecord: RecordOf<IStateMachine> = stateFactory();

/**
 * Traverse Reducer Array
 *
 * Iterates over an array of reducer slice methods to generate a single change
 * of state in redux store.
 * @param {Array<Reducer>} reducerArray Array of reducer methods (see
 *                                      `createReducer` in `./reducer-slide`).
 * @return {Reducer}       Standard reducer function.
 */
export function traverseReducerArray<S = IStateMachine, A extends Action = AnyAction>(
  reducerArray: Reducer<RecordOf<S>, A>[],
): Reducer<RecordOf<S>, A> {
  return (
    state: RecordOf<S> | undefined,
    action: A,
  ): RecordOf<S> => reducerArray.reduce((
    newState: RecordOf<S>,
    reducerCallback: Reducer<RecordOf<S>, A>,
  ): RecordOf<S> => reducerCallback(
    newState,
    action,
  ),
  state as unknown as RecordOf<S>);
}

/**
 * Create State Machine
 *
 * Translates a Hashmap of state-based reducer into a standard reducer function.
 * @param {IStateMachineHash}   machineHash         Hashmap of (state => reducer).
 * @param {RecordOf} initialState        Defined initial state for the
 *                                       reducer slice.
 * @param {string}   initialMachineState Value for the initial/fallback state.
 * @return {Reducer} Standard reducer.
 */
export function createStateMachine<S = IStateMachine, A extends Action = AnyAction>(
  machineHash: IStateMachineHash,
  initialState?: RecordOf<S>,
  initialMachineState: string = INIT,
): Reducer<RecordOf<S>, A> {
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

type IChangeState<S extends IStateMachine> = (state: RecordOf<S>) => RecordOf<S>;

/**
 * Change State To
 *
 * Reducer factory for changing machine state.
 * @param {string|symbol} newState Value to which to transition the machine state.
 * @return {function}     Reducer function to change machine state.
 */
export function changeStateTo<S extends IStateMachine>(
  newState: string | symbol,
): IChangeState<S> {
  return (
    state: RecordOf<S>,
  ): RecordOf<S> => state.set(KEY_STATE, newState);
}

/**
 * Change State
 *
 * Transition machine state immediately.
 * @param {RecordOf}      state    Current state object.
 * @param {string|symbol} newState Value to which to transition the machine state.
 * @return {RecordOf}     New state object with changed machine state.
 */
export function changeState<S extends IStateMachine>(
  state: RecordOf<S>,
  newState: string | symbol,
): RecordOf<S> {
  return changeStateTo<S>(newState)(state);
}
