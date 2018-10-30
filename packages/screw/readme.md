# Screw

In classic mechanics, the screw was used to hold two or more objects together.

With Redux, this screw is primarily used for joining one or more slices of a Redux
store to a React component. This is done by providing some abstractions for creating
and aggregating memoized selectors.


## Core Concepts

The screw has one purpose: to join the redux store to the application by memoizing
"selectors."


### Selector

While many have developed applications simply by manually digging through the redux
store via `bindStateToProps()`, it tightly couples all consumers to the specific
shape of the redux store. A good way to loosen this is by creating selector
functions to provide an API for retrieving data from the store.

Applications go from:
```js
bindStateToProps(state => ({
  myValue: state.slice.config.values.my,
  someImmutableValue: state.immutableSlice.getIn(['other', 'cool', 'thing'])
}))
```

to:

```js
bindStateToProps(state => ({
  myValue: sliceSelectors.myConfigValue(state),
  someImmutableValue: immutableSliceSelectors.otherCoolThing(state)
}))
```

It's a small jump, but it means that reorganizing the shape of the reducers
is a much easier change (the actual reducer changes and the related selectors)
when compared to the first (reducer changes plus every related application
file). Think of selectors as the "read" API to the store.



## Usage

Screw provides only three exported functions: `createSelector()`, `getSlice()`, `getStateSelector()`. Of these, `createSelector()` will be used the most as it
creates the memoized selector methods.


### Simple Selector

A simple selector retrieves one value from the redux state.

```js
export const otherCoolThing = createSelector(
  state => state.immutableSlice.getIn(['other', 'cool', 'thing'])
)

// Or, if the entire state is immutable:
export const otherCoolThing = createSelector(
  state => state.getIn(['immutableSlice', 'other', 'cool', 'thing'])
)
```

If the entire store is immutable, then it may be better to create a selector that
returns the relevant state slice before going further. Seeing this as potential
boilerplate, we've abstracted that out:

```js
export const otherCoolThing = createSelector(
  'immutableSlice', // ideally, this would be a const type pre-defined
  stateSlice => stateSlice.getIn(['other', 'cool', 'thing'])
)
```


### Complex Selector

A complex selector first extracts one or more values from the redux state before
deriving an nth value to return:

```js
export const captPlanet = createSelector([
  earthSelector.getPower,
  fireSelector.getPower,
  windSelector.getPower,
  waterSelector.getPower,
  heartSelector.getPower,
  (earth, fire, wind, water, heart) => `Captain Planet!`
])

export const captPlanet = createSelector([
  earthSelector.getPower,
  fireSelector.getPower,
  windSelector.getPower,
  waterSelector.getPower,
  heartSelector.getPower,
], (earth, fire, wind, water, heart) => `Captain Planet!`
)
```

The array of functions passed to `createSelector` should mostly be other selectors,
except for the final function. The final function (can be passed as the last array
element or as the second parameter to `createSelector`) uses the results of the
other selectors as its parameters rather than the redux state itself.


## Example

Check out the example directory for a full example of a wedge-backed reducer.
