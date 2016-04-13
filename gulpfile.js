'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');

var imageFiles = './src/images/**/*.png';

gulp.task('images', function() {
	return gulp.src(imageFiles)
		.pipe(gulp.dest('./static/images/')) // copy non thumbnails

		// Make thumbnails
		.pipe(imageResize({
			width: 400,
			crop: false,
			format: 'png',
			filter: 'Catrom'
		}))
		// Append thumbnail names
		.pipe(rename(function (path) {
			path.basename += "_thumb";
		}))
		// Write thumbs
		.pipe(gulp.dest('./static/images/'));
});

gulp.task('default', function() {
	return gulp.watch(imageFiles, ['images']);
});