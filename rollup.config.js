import eslint from 'rollup-plugin-eslint'
import buble from 'rollup-plugin-buble'

export default {
	format: 'umd'
	, entry: process.env.npm_package_jsnext_main
	, dest: process.env.npm_package_main
	, moduleName: process.env.npm_package_name
	, moduleId: process.env.npm_package_name
	, plugins: [ eslint(), buble() ]
}
