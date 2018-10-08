# Wedge

In classic mechanics, the wedge was used to separate two objects (or portions of a
single object). It could also lift up or hold up a single object.

With Redux, this wedge is primarily used for separating slices within a store. This
is done by providing some basic methods to create a reducer slice as a state
machine, as well as aggregate everything into a root reducer.


## Core Concepts

The wedge is focused on two closely related concepts around the Redux reducer: state machine and reducing boilerplate.


### State Machine

Maintaining the simplicity of a reducer is paramount to the success of Redux. At
the most elementary level, operating a reducer as a state machine can prevent
unintended effects on the reducer store.

Stop me if you've experienced this before: you have an autocomplete component that
performs an async request for data. While the asyc request is happening, you need
to show some feedback to the user so they know to wait and that the app isn't
broken. So, you add an `isFetching` value to the reducer. Of course, it's an
autocomplete, and it's possible the user could have put invalid data. So, you add
an `isErrored` value to the reducer as well. Both of these values are tracked
throughout your reducer. Things get hairy because every related action could
change one or both of those two values.

There is a better way: enter [finite state machines](https://www.smashingmagazine.com/2018/01/rise-state-machines/).
Instead of tracking these two values, what if we had a single one to denote
not only the _state_ of the reducer but also what actions are acceptable given
the current reducer state.

`createStateMachine` is provided to transform a reducer into a state machine. Its
only required parameter is a plain JS object acting like a hashmap between states
and their reducers callbacks. This state machine method should then be registered
with redux via `combineReducers` as it normally happens. By default, the initial
state is `INIT` (and that's exported from wedge for convenience). Of course, you
can change that value by providing it to `createStateMachine` as the second
parameter. Also, be sure to provide a `state` key (exported as `KEY_STATE`)
for tracking the reducer's state. Don't like that key name? It's configurable
as the third parameter.



### Reducing Boilerplate

But wait, there's more! As it often happens, you'll have a small piece of logic
that can be called in multiple states. In an effort to support DRY-ness, we've
made `createStateMachine` so that instead of a reducer callback for a state, you
can also provide an array of reducer callbacks. Now, you can write really small
reducer methods and aggregate them.

Writing a really small reducer method generally looks like a single
```js
function (state = INITIAL_STATE, action) {
  if (action.type === SOME_ACTION) {
    const changedState = state.merge({/* changes */});
    // your logic here

    return changedState;
  }

  return state;
}
```
That looks like a bit of boilerplate, no? Well, `createReducer` comes to
the rescue. It takes three parameters: the expected action (`SOME_ACTION`
above), the initial state, and a callback for what to change based on the
action's payload (`(state, actionPayload, action) => state.merge({})`).

Of course, you'll likely use the same initial state across all of these
reducer methods, so why not abstract that out as well by using
`createReducerFactory(initialState)` to return a two-parameter `createReducer`.

In traditional redux setups, you'd then import all of these reducers into
a single root reducer file and push them through `combineReducers` from Redux.
Why not cut that out and push reducers as they're defined. For that effort, we
have `registerReducer` to add a reducer to a central registry with a given reducer
key (called a namespace here). And for convenience, there's a `registerStateMachine`
function which first calls `createStateMachine` and then `registerReducer` to get
a state machine reducer quickly added to the reducer registry. Then, in your
root reducer file, you only need to call `createRootReducer()` in order to get
the same end result as writing that single hashmap and passing it to
`combineReducers` but with a little less boilerplate.


### Immutable

Data immutability is important for several reasons, so we are enforcing the usage
of ImmutableJS. The aggregrator (`register*` and `createRootReducer` methods) use
Redux-Immutable under the hood.



## Example

Check out the example directory for a full example of a wedge-backed reducer.
