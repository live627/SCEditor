'use strict';

let gulp       = require('gulp');
var spritesmith = require('gulp.spritesmith');

 
gulp.task('sprite', function () {
  var spriteData = gulp.src('src/themes/icons/src/famfamfam/*.png').pipe(spritesmith({
    imgName: 'famfamfam.png',
    cssName: 'famfamfam.sass',
  cssTemplate: function (data) {
    // Convert sprites from an array into an object
    var spriteObj = [
'div.sceditor-grip, .sceditor-button div',
'	background-image: url("famfamfam.png")',
'	background-repeat: no-repeat',
'	width: 16px',
'	height: 16px'
    ];
    data.sprites.forEach(function (sprite) {
      // Grab the name and store the sprite under it
      var name = sprite.name;
      spriteObj.push('.sceditor-button-' + sprite.name + ' div');
      spriteObj.push('	background-position: ' + sprite.px.offset_x + ' ' + sprite.px.offset_y);
    });
    return spriteObj.join('\n');
  }
  }));
  return spriteData.pipe(gulp.dest('src/themes/icons/'));
});
