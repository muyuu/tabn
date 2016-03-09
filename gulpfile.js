const g = require("gulp");
const $ = require( 'gulp-load-plugins' )();
const connect = require('gulp-connect');

const port = 3000;

filename = "tabn";
file = `${filename}.js`;


// local server
g.task("connect", ()=>{
    connect.server({
        port: port,
        livereload: true
    });

    const options = {
        url: `http://localhost:${port}`,
        app: "Google Chrome"
    };

    g.src("./index.html")
    .pipe($.open("", options));
});


g.task('lint', ()=>{
    g.src([file])
    .pipe($.eslint())
    .pipe($.eslint.format());
});


g.task('jscs', ()=>{
    g.src(file)
    .pipe($.jscs());
});



g.task("default", ['connect'], ()=>{
    g.watch("**/*.js", ["lint", "jscs"]);
});


// build
g.task('build', ()=>{
    g.src(file)
    .pipe($.sourcemaps.init())
    .pipe($.rename({
        basename: `${filename}.min`,
        extname: `.js`
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(g.dest('./'));
});


