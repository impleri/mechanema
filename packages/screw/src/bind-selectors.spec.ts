import * as faker from 'faker';
import { Map } from 'immutable';
import { bindStateToSelector, bindStateToSelectors, IBoundSelectorHash } from './bind-selectors';

function createSelectorConfig(): any {
  const value = faker.lorem.paragraphs();
  const selector = jest.fn().mockReturnValue(value);

  return {
    key: faker.random.word(),
    selector,
    value,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('bindStateToSelector', () => {
  it('passes state to the selector', () => {
    const mockState = Map({});
    const selector = createSelectorConfig();

    const receivedValue = bindStateToSelector(selector.selector, mockState);

    expect(receivedValue).toBe(selector.value);
  });
});

describe('bindStateToSelectors', () => {
  it('proxies bindStateToSelector if selectors is a function', () => {
    const mockState = Map({});
    const selector = createSelectorConfig();

    const receivedValue = bindStateToSelectors(selector.selector, mockState);

    expect(receivedValue).toBe(selector.value);
  });

  it('maps hashmap to bindStateToSelector if selectors is a hashmap', () => {
    const mockState = Map({});
    const selectors = new Array(faker.random.number(10)).fill('')
      .map(createSelectorConfig);

    const selectorHash: IBoundSelectorHash = selectors.reduce(
      (aggregator: IBoundSelectorHash, selector): IBoundSelectorHash => {
        const newAggregator = aggregator;

        newAggregator[selector.key] = selector.selector;

        return newAggregator;
      },
      {},
    );
    // Add non-function to hash
    const stringKey = faker.random.word();
    const stringValue = faker.lorem.sentence();
    selectorHash[stringKey] = stringValue;

    const expectedValue: IBoundSelectorHash = selectors.reduce(
      (aggregator: IBoundSelectorHash, selector) => {
        const newAggregator = aggregator;

        newAggregator[selector.key] = selector.value;

        return newAggregator;
      },
      {},
    );
    expectedValue[stringKey] = stringValue;

    const receivedValue = bindStateToSelectors(selectorHash, mockState);

    expect(receivedValue).toEqual(expectedValue);
  });
});
