// rollup.config.js
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/tableofcontents.js', // 入力ファイルのパス
  output: {
    file: 'dist/tableofcontents.min.js',
    format: 'iife',
    name: 'webflowtableofcontents',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ]
};
