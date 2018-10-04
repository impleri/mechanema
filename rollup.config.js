import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const packageRootDir = process.cwd();
const inputFile = path.join(packageRootDir, 'src/index.js');
const pkg = require(path.join(packageRootDir, 'package.json'));

export default [
  {
    input: inputFile,
    output: {
      name: pkg.name,
      file: path.join(packageRootDir, pkg.browser),
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          'immutable': ['Map', 'List'],
        }
      }),
    ],
  },

  {
    input: inputFile,
    external: [
      'immutable',
      'redux',
      'redux-immutable',
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
    ]
  }
];
