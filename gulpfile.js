import {format} from './src/lib/utils.js';

import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'uglify-js';
import sass   from 'gulp-sass';
import  CleanCSS   from 'clean-css';
import  map from 'vinyl-map';
import  Spritesmith from 'spritesmith';
import  zip   from 'gulp-zip';

let
	m = () =>
	{
		return gulp.src('./dist/sceditor.js')
			.pipe(map(buff =>
			{
				var result = uglify.minify(buff.toString());
				if (result.error)

					throw result.error;

				return result.code;
			}))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('./dist'));
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
				spriteObj.push(
					format(`.sceditor-button-{0} div
	background-position: {1}px {2}px`,
					path.parse(sprite).name,
					-result.coordinates.sprite.x, -result.coordinates.sprite.y
					));

			fs.writeFileSync('src/themes/icons/famfamfam.sass', spriteObj.join('\n'));
			fs.writeFileSync('src/themes/icons/famfamfam.png', result.image);
		});

		return gulp.src('src/themes/icons/famfamfam.png')
			.pipe(gulp.dest('dist'));
	},
	css = () =>
	{
		return gulp.src('src/themes/*.scss')
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest('dist'))
			.pipe(map(buff => new CleanCSS().minify(buff.toString()).styles))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('dist'));
	},
	z = () =>
	{
		return gulp.src(['dist/*', '!dist/sceditor.zip'])
			.pipe(zip('sceditor.zip'))
			.pipe(gulp.dest('dist'));
	};

export default gulp.series(m, sprite, css, z);
export {
	uglify as m,
	sprite,
	css,
	zip as z
};
