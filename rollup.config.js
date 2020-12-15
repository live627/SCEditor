export default [
	{
		input: './src/sceditor.js',
		output: {
			file: './dist/sceditor.js',
			name: 'sceditor',
			format: 'iife'
		}
	},
	{
		input: './src/formats/bbcode.js',
		output: {
			file: './dist/bbcode.js',
			name: 'bbcode',
			format: 'iife'
		}
	},
	{
		input: './src/sceditor.bbcode.js',
		output: {
			file: './dist/sceditor.bbcode.js',
			name: 'sceditor',
			format: 'iife'
		}
	},
	{
		input: './src/formats/xhtml.js',
		output: {
			file: './dist/xhtml.js',
			name: 'xhtml',
			format: 'iife'
		}
	},
	{
		input: './src/sceditor.xhtml.js',
		output: {
			file: './dist/sceditor.xhtml.js',
			name: 'sceditor',
			format: 'iife'
		}
	}
];
