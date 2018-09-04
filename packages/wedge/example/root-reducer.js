import {
  createRootReducer,
} from '../dist';
import './my-reducer';

// Aggregates all registered reducers and generated the root reducer to use in redux
export default createRootReducer();
