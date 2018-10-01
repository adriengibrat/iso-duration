import buble from 'rollup-plugin-buble'

export default [{
	input: './src/index.js',
	output: {
		file: process.env.npm_package_main,
		name: process.env.npm_package_name,
		format: 'umd',
	},
	moduleId: process.env.npm_package_name,
	plugins: [ buble() ],
}, {
	input: './src/index.js',
	output: {
		file: process.env.npm_package_module,
		format: 'es',
	},
	plugins: [ buble() ],
}, {
	input: './src/index.js',
	output: {
		file: process.env.npm_package_jsnext_main,
		format: 'es',
	},
}]
