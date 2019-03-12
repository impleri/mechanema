// eslint-disable-next-line import/no-extraneous-dependencies
import { bindSelectors } from '@mechanema/screw';

import * as selectors from './my-selector';

const connect = () => {}; // import { connect } from 'react-redux';

const mapStateToProps = state => bindSelectors({
  magic: selectors.simple,
  something: selectors.complex,
}, state);

const SomeComponent = ({ magic, something }) => (
  `${magic}: ${something}`
);

export default connect(mapStateToProps)(SomeComponent);
