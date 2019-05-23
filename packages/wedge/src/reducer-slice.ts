import { RecordOf } from 'immutable';
import { Action, Reducer } from 'redux';

type IPayload = any;

export interface IReducerSlice<S = any, P = IPayload, A = any> {
  (
    state: RecordOf<S> | undefined,
    payload: Action<A> | P,
    action: Action<A>,
  ): RecordOf<S>;
}

export interface IPayloadAction<T = any, P = IPayload> extends Action<T> {
  payload?: P;
}

function isPayloadAction(toBeDetermined: Action): toBeDetermined is IPayloadAction {
  return ((toBeDetermined as IPayloadAction).payload);
}

/**
 * Create Reducer
 *
 * Creates a reducer function that upserts the redux store when given the
 * expected action.
 * @param {string}               onAction     Expected redux action.
 * @param {SliceCallback}        stateFn      Callback to trigger state change
 *                                            if received expected action.
 * @return {Reducer}                          Standard reducer function.
 */
export function createReducer<S = any, A extends Action<any> = IPayloadAction>(
  onAction: string | symbol,
  stateFn: IReducerSlice<S>,
): Reducer<RecordOf<S>, A> {
  return (state: RecordOf<S> | undefined, action: A): RecordOf<S> => {
    if (action && action.type === onAction) {
      const payload = (isPayloadAction(action)) ? (action as IPayloadAction).payload : action;
      return stateFn(state, payload, action);
    }

    return state as RecordOf<S>;
  };
}
