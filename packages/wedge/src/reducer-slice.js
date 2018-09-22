/**
 * Create Reducer
 *
 * Creates a reducer function that upserts the redux store when given the
 * expected action.
 * @param {string}               onAction     Expected redux action.
 * @param {Immutable.Collection} initialState Defined initial state for the
 *                                            reducer slice.
 * @param {function}             stateFn      Callback to trigger state change
 *                                            if received expected action.
 * @return {function}                         Standard reducer function.
 */
export function createReducer(onAction, initialState, stateFn) {
  return (state = initialState, action) => {
    if (action.type === onAction) {
      return stateFn(state, action.payload, action);
    }

    return state;
  };
}

/**
 * Create Reducer Factory
 *
 * Factory method to inject a single initial state into multiple calls to
 * createReducer.
 * @param {Immutable.Collection} initialState Initial state to use for reducer
 *                                            methods.
 * @return {function}                         Curried proxy to createReducer.
 */
export default function createReducerFactory(initialState) {
  return (onAction, stateFn) => createReducer(onAction, initialState, stateFn);
}
