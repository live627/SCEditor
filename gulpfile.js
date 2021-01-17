import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import rename from 'gulp-rename';
import sass   from 'gulp-sass';
import  CleanCSS   from 'clean-css';
import  map from 'vinyl-map';
import  Spritesmith from 'spritesmith';
import  zip   from 'gulp-zip';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';

let
	out = [],
	addFile = (n, x) =>
	{
		let
			f = () =>
				rollup({
					input: `./src/${x}.js`
				}).then(bundle =>
				{
					bundle.write(
						{
							file: `./dist/${x}.js`,
							name: n,
							format: 'iife'
						}
					);
					bundle.write(
						{
							file: `./dist/${x}.min.js`,
							name: n,
							format: 'iife', plugins: [terser()]
						}
					);
				});
		f.displayName = `Compiling ${x}.js...`;
		return f;
	},
	javascript = done =>
	{
		out.push(addFile('sceditor','sceditor'));
		out.push(addFile('bbcode','formats/bbcode'));
		out.push(addFile('sceditor','sceditor.bbcode'));
		out.push(addFile('xhtml','formats/xhtml'));
		out.push(addFile('sceditor','sceditor.xhtml'));

		return gulp.parallel(...out, seriesDone =>
		{
			seriesDone();
			done();
		})();
	},
	sprites = fs.readdirSync('src/themes/icons/src/famfamfam')
		.filter(x => path.extname(x).toLowerCase() === '.png'),
	sprite = () =>
	{
		sprites.sort();
		Spritesmith.run({
			src: sprites.map(x => `src/themes/icons/src/famfamfam/${x}`)
		}, (err, result) =>
		{
			if (err)
				throw err;

			var spriteObj = [
				`.sceditor-button div
	background-image: url("famfamfam.png")
	background-repeat: no-repeat
	width: 16px
	height: 16px`
			];
			for (const sprite in result.coordinates)
				spriteObj.push(`.sceditor-button-${path.parse(sprite).name} div
	background-position: ${-result.coordinates[sprite].x}px ${-result.coordinates[sprite].y}px`);

			fs.writeFileSync('src/themes/icons/famfamfam.sass', spriteObj.join('\n'));
			fs.writeFileSync('src/themes/icons/famfamfam.png', result.image);
		});

		return gulp.src('src/themes/icons/famfamfam.png')
			.pipe(gulp.dest('dist'));
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
	javascript,
	sprite,
	css,
	zip as z
};
