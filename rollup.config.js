import flow from 'rollup-plugin-flow';
import path from 'path';

const packageRootDir = process.cwd();
const inputFile = path.join(packageRootDir, 'src/index.js');
const pkg = require(path.join(packageRootDir, 'package.json'));

export default {
  input: inputFile,
  external: [
    'immutable',
    'moize',
    'redux',
    'redux-immutable',,
    '@mechanema/wedge'
  ],
  output: [
    {
      file: path.join(packageRootDir, pkg.main),
      format: 'cjs',
    },
    {
      file: path.join(packageRootDir, pkg.module),
      format: 'es',
    },
  ],
  plugins: [
    flow({
      pretty: true,
    }),
  ]
};
