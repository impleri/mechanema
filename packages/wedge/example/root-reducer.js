// eslint-disable-next-line import/no-extraneous-dependencies
import { createRootReducer } from '@mechanema/wedge';

// Register all the reducers
import './my-reducer';

// Aggregates all registered reducers and generated the root reducer to use in redux
export default createRootReducer();
