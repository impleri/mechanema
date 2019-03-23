'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var wedge = require('@mechanema/wedge');
var immutable = require('immutable');
var moize = _interopDefault(require('moize'));

function bindStateToSelector(selector, state) {
    return selector(state);
}
function bindStateToSelectors(selectors, state) {
    if (typeof selectors === 'function') {
        return bindStateToSelector(selectors, state);
    }
    return Object.keys(selectors).reduce((aggregator, selectorKey) => {
        const newAggregator = aggregator;
        const selector = selectors[selectorKey];
        newAggregator[selectorKey] = selector;
        if (typeof selector === 'function') {
            newAggregator[selectorKey] = bindStateToSelector(selector, state);
        }
        return newAggregator;
    }, {});
}

function getSlice(namespace) {
    return (state) => state.get(namespace, immutable.Map());
}
function createSimpleSelector(selectorFn) {
    if (typeof selectorFn === 'function') {
        if (selectorFn.isMoized) {
            return selectorFn;
        }
        return moize(selectorFn);
    }
    return moize.maxArgs(0)(() => selectorFn);
}
function createComplexSelector(dependencies, aggregateFn) {
    const memoizedDeps = dependencies.map(createSimpleSelector);
    const memoizedAggregate = moize(aggregateFn);
    return Object.assign((state) => {
        const values = memoizedDeps.map(dependency => dependency(state));
        return memoizedAggregate(...values);
    }, {
        isMoized: true,
    });
}
function createSelector(mixedParam, selectorFn) {
    let selector = () => { };
    if (Array.isArray(mixedParam)) {
        const aggregateFn = (typeof selectorFn === 'function') ? selectorFn : mixedParam.pop();
        const dependencies = mixedParam;
        selector = createComplexSelector(dependencies, aggregateFn);
    }
    else if (typeof selectorFn === 'function' && typeof mixedParam === 'string') {
        selector = createComplexSelector([getSlice(mixedParam)], selectorFn);
    }
    else {
        selector = createSimpleSelector(mixedParam);
    }
    return selector;
}

function getStateSelector(namespace, stateKey = wedge.KEY_STATE, initState = wedge.INIT) {
    return createSelector(namespace, (sliceState) => sliceState.get(stateKey, initState));
}

exports.bindStateToSelector = bindStateToSelector;
exports.bindStateToSelectors = bindStateToSelectors;
exports.createSelector = createSelector;
exports.getSlice = getSlice;
exports.getStateSelector = getStateSelector;
