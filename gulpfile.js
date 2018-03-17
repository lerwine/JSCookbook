var gulp = require('gulp');
var webserver = require('gulp-webserver');
var util = require('util');
gulp.task('startWebServer', function() {
    var stream = gulp.src('.').pipe(webserver());
    
console.log(util.inspect(stream, false, 5, true));
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port: 8080
        }));
});
gulp.task('stopWebServer', function() {
    var stream = gulp.src('.').pipe(webserver());
    stream.emit('kill');
});