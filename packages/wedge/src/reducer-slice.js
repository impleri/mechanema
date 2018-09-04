export function createReducer(onAction, initialState, stateFn) {
  return (state = initialState, action) => {
    if (action.type === onAction) {
      return stateFn(state, action.payload, action);
    }

    return state;
  };
}

export default function createReducerFactory(initialState) {
  return (onAction, stateFn) => createReducer(onAction, initialState, stateFn);
}
