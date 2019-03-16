import { Map } from 'immutable';
import { Action, Reducer } from 'redux';

export interface IReducerSlice {
  (
    state: Map<any, any>,
    payload: Action | any,
    action: Action,
  ): Map<any, any>;
}

export interface IPayloadAction extends Action {
  payload?: any;
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
export function createReducer(
  onAction: string,
  stateFn: IReducerSlice,
): Reducer {
  return (state: Map<any, any>, action: IPayloadAction): Map<any, any> => {
    if (action && action.type === onAction) {
      return stateFn(state, action.payload || action, action);
    }

    return state;
  };
}
