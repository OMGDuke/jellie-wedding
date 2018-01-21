var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-html-minifier');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');

gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
    .pipe(clean());
});

gulp.task('public', function() {
  return gulp.src(['src/public/**/*.*', '!src/public/images/**/*.*'])
    .pipe(gulp.dest('dist/public'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('images', function() {
  return gulp.src('src/public/images/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('dist/public/images'))
    .pipe(connect.reload());
});

gulp.task('images-webp', function() {
	return gulp.src('src/public/images/**/*.*')
    .pipe(webp())
    .pipe(gulp.dest('dist/public/images'))
    .pipe(connect.reload());
});

gulp.task('sass', function(){
  return gulp.src('src/sass/**/*.scss')
    .pipe(plumber()) 
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/public/css'))
    .pipe(connect.reload());
});

gulp.task('watch', ['webserver'], function() {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/public/images/**/*.*', ['images']);
  gulp.watch('src/public/**/*.*', ['public']);
})

gulp.task('webserver', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('default', ['clean'], function() {
  gulp.start('html', 'public', 'images', 'images-webp', 'sass');
});

gulp.task('dev', ['default'], function() {
  gulp.start('watch');
});