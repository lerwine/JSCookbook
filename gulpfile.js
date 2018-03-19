var gulp = require('gulp');
var webserver = require('gulp-webserver');
var util = require('util');
gulp.task('startWebServer', function() {
    gulp.src('.').pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port: 8085
        }));
});
gulp.task('stopWebServer', function() {
    var stream = gulp.src('.').pipe(webserver());
    stream.emit('kill');
});