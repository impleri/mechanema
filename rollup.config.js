import path from 'path';
import typescript from 'rollup-plugin-typescript2';

const packageRootDir = process.cwd();
const inputFile = path.join(packageRootDir, 'src/index.ts');
const pkg = require(path.join(packageRootDir, 'package.json'));

const overrides = {
  compilerOptions: {
    declarationDir: path.join(packageRootDir, 'src'),
  },
  include: [
    path.join(packageRootDir, 'src')
  ],
  exclude: [
    path.join(packageRootDir, '..', '..', 'node_modules'),
    "**/*.spec.ts"
  ]
};

export default {
  input: inputFile,
  external: [
    'immutable',
    'moize',
    'redux',
    'redux-immutable',
    'redux-saga',
    'redux-saga/effects',
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
    typescript({
      tsconfig: path.resolve(packageRootDir, '../../tsconfig.json'),
      useTsconfigDeclarationDir: true,
      tsconfigOverride: overrides
    }),
  ]
};
