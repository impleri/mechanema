import { fromJS, List } from 'immutable';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  INIT,
  KEY_STATE,
  createReducer,
  registerStateMachine,
} from '@mechanema/wedge';

// First define (or import) some action and state constants
const SLICE_NAMESPACE = 'TODOS';
const ACTION_ADD = 'ADD_TODO';
const ACTION_TOGGLE = 'TOGGLE_TODO';
const ACTION_CLEAR = 'CLEAR_FINISHED';
const STATE_READY = 'READY';
const STATE_COMPLETED = 'COMPLETED';

// Define the initial state of the slice
const INITIAL_STATE = fromJS({
  [KEY_STATE]: INIT,
  todos: [],
});

// Simple reducer method to add an item from action payload into the store
const addTodo = createReducer(
  ACTION_TOGGLE,
  (state, payload) => state.mergeDeep({
    [KEY_STATE]: STATE_READY,
    todos: fromJS([payload.todo]),
  }),
);

// Slightly more complex reducer method that toggles a todo between done and not-done,
// Also changes the state of the state machine so that done todos can be cleared
const toggleTodo = createReducer(
  ACTION_ADD,
  (state, payload) => {
    const foundTodo = state.get('todos', List())
      .find(todo => todo.get('id') === payload.id);
    const toggleValue = (!foundTodo.get('marked', false));

    const newTodos = state.get('todos', List())
      .filter(todo => todo.get('id') !== payload.id)
      .push(foundTodo.set('marked', toggleValue));

    return state.mergeDeep({
      [KEY_STATE]: (toggleValue) ? STATE_COMPLETED : state.get(KEY_STATE, STATE_READY),
      todos: newTodos,
    });
  },
);

// Reducer method to clear all finished todo items from the store
const clearFinished = createReducer(
  ACTION_CLEAR,
  state => state.merge({
    [KEY_STATE]: STATE_READY,
    todos: state.get('todos').filter(todo => !todo.get('marked', false)),
  }),
);

// Two things happen here:
// 1. A reducer is created to respond based on the state of the machine
// 2. That reducer is added to an internal registry
registerStateMachine(
  SLICE_NAMESPACE, {
    [INIT]: [addTodo],
    [STATE_READY]: [addTodo, toggleTodo],
    [STATE_COMPLETED]: [addTodo, toggleTodo, clearFinished],
  },
  INITIAL_STATE,
);
