import { Action, Reducer } from 'redux';

type IPayload = any;

export interface IReducerSlice<S = any, A = any> {
  (
    state: S | undefined,
    payload: Action<A> | IPayload,
    action: Action<A>,
  ): S;
}

export interface IPayloadAction extends Action {
  payload?: IPayload;
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
): Reducer<S, A> {
  return (state: S | undefined, action: A): S => {
    if (action && action.type === onAction) {
      const payload = (isPayloadAction(action)) ? (action as IPayloadAction).payload : action;
      return stateFn(state, payload, action);
    }

    return state as S;
  };
}
