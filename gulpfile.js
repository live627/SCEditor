if (!String.format) {
	String.format = function (format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] !== 'undefined'
				? args[number]
				: match
			;
		});
	};
}
import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'uglify-js';
import sass   from 'gulp-sass';
import  CleanCSS   from 'clean-css';
import  map from 'vinyl-map';
import  spritesmith   from 'gulp.spritesmith';
import {rollup} from 'rollup';
import  zip   from 'gulp-zip';

let
	javascript = () => {
		return rollup({
			input: './src/sceditor.js'
		}).then(bundle => {
			return bundle.write({
				file: './dist/sceditor.js',
				name: 'sceditor',
				format: 'iife'
			});
		});
	},
	m = () => {
		return gulp.src('./dist/sceditor.js')
			.pipe(map(buff => {
				var result = uglify.minify(buff.toString());
				if (result.error) throw result.error;
				return result.code;
			}))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('./dist'));
	},
	sprite = () => {
		var spriteData = gulp.src('src/themes/icons/src/famfamfam/*.png')
			.pipe(spritesmith({
				imgName: 'famfamfam.png',
				cssName: 'famfamfam.sass',
				cssTemplate: function (data) {
					var spriteObj = [
						`div.sceditor-grip, .sceditor-button div
	background-image: url("famfamfam.png")
	background-repeat: no-repeat
	width: 16px
	height: 16px`
					];
					data.sprites.forEach(function (sprite) {
						spriteObj.push(
							String.format(`.sceditor-button-{0} div
	background-position: {1} {2}`,
							sprite.name,
							sprite.px.offset_x, sprite.px.offset_y));
					});
					return spriteObj.join('\n');
				}
			}));
		return spriteData.pipe(gulp.dest('src/themes/icons/'));
	},
	copy = () => {
		return gulp.src('src/themes/icons/famfamfam.png')
			.pipe(gulp.dest('dist'));
	},
	css = () => {
		return gulp.src('src/themes/*.scss')
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest('dist'))
			.pipe(map(buff => new CleanCSS().minify(buff.toString()).styles))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('dist'));
	},
	z = () => {
		return gulp.src(['dist/*', '!dist/sceditor.zip'])
			.pipe(zip('sceditor.zip'))
			.pipe(gulp.dest('dist'));
	};

export default gulp.series(javascript, m, sprite, copy, css, z);
export {
	javascript,
	uglify as m,
	sprite,
	css,
	zip as z
};
