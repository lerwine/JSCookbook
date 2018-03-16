var gulp = require('gulp');
var webserver = require('gulp-webserver');
 
gulp.task('startWebServer', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            fallback: 'src/index.html',
            port: 8080
        }));
});
gulp.task('stopWebServer', function() {
    var stream = gulp.src('.').pipe(webserver());
    stream.emit('kill');
});