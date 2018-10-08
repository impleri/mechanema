import * as selectors from './my-selector';

const connect = () => {}; // import { connect } from 'react-redux';

const mapStateToProps = state => ({
  magic: selectors.simple(state),
  something: selectors.complex(state),
});

const SomeComponent = ({ magic, something }) => (
  `${magic}: ${something}`
);

export default connect(mapStateToProps)(SomeComponent);
