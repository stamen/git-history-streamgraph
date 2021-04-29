import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
  external: ["d3", "array-blur","d3-area-label"],
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true,
    globals: {"d3":"d3", "d3-area-label":"d3","array-blur":"d3"}
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser() // minify, but only in production
	]
};
