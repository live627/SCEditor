import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import sass   from 'gulp-sass';
import  CleanCSS   from 'clean-css';
import  map from 'vinyl-map';
import  zip   from 'gulp-zip';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';

let
	addFile = (n, x, b) =>
	{
		let
			d = b ? `${x}/${n}` : x,
			f = () =>
				rollup({
					input: `./src/${d}.js`
				}).then(bundle =>
				{
					bundle.write(
						{
							file: `./dist/${d}.js`,
							name: n.replace(/\W+/g,'_'),
							format: 'iife'
						}
					);
					bundle.write(
						{
							file: `./dist/${d}.min.js`,
							name: n.replace(/\W+/g,'_'),
							format: 'iife', plugins: [terser()]
						}
					);
				});
		f.displayName = `Compiling ${d}.js...`;
		return f;
	},
	javascript = done =>
	{
		let
			out = [],
			mapFiles = d => fs.readdirSync(d).filter(x => !x.includes('icons'))
				.map(x => addFile(x.slice(0, -3), d.slice(4),  true));

		out.push(addFile('sceditor','sceditor', false));
		out.push(addFile('bbcode','formats',  true));
		out.push(addFile('sceditor','sceditor.bbcode', false));
		out.push(addFile('xhtml','formats',  true));
		out.push(addFile('sceditor','sceditor.xhtml', false));
		out = out.concat(mapFiles('src/languages'));
		out = out.concat(mapFiles('src/icons'));
		out = out.concat(mapFiles('src/plugins'));

		return gulp.parallel(...out, seriesDone =>
		{
			seriesDone();
			done();
		})();
	},
	sprites = fs.readdirSync('src/themes/icons/famfamfam')
		.filter(x => x.slice(-3).toLowerCase() === 'png'),
	sprite = cb =>
	{
		sprites.sort();
		var spriteObj = [];
		for (const sprite of sprites)
		{
			var data = fs.readFileSync(`src/themes/icons/famfamfam/${sprite}`, 'base64');
			spriteObj.push(`${sprite.slice(0, -4).toLowerCase()}: '${data}'`);
		}
		fs.writeFileSync('src/icons/famfamfam-icons.js', `export default\n{\n\t${spriteObj.join(',\n\t')}\n}\n`);

		return cb();
	},
	css = () =>
		gulp.src('src/themes/*.scss')
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest('dist'))
			.pipe(map(buff => new CleanCSS().minify(buff.toString()).styles))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('dist')),
	z = () =>
		gulp.src(['dist/**/*', '!dist/sceditor.zip'])
			.pipe(zip('sceditor.zip'))
			.pipe(gulp.dest('dist'));

export default gulp.series(gulp.parallel(javascript, sprite, css), z);
export {
	sprite,
	javascript,
	css,
	zip as z
};
