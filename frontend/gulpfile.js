/**
 * Created by Nandun Bandara on 9/18/17.
 */

'use strict';
const gulp =  require('gulp');
const $ = require('gulp-load-plugins')({lazy:true});
const args = require('yargs').argv;
const del = require('del');
const bowerFiles = require('main-bower-files');
const es = require('event-stream');
const wiredep = require('wiredep').stream;

let config = {
    paths: {
        index: 'index.html',
        html: ['./**/*.html'],
        css: ['./styles/*.css'],
        js: ['./app/**/*.js'],
        app: ['./app/**'],
        dev: './.tmp/'
    }
};

gulp.task('connect', ()=>{
    $.connect.server({
        root: './',
        livereload: true,
        port: 8082
    });
});

const log = (msg)=>{
    if(typeof(msg)=== 'object'){
        for (let item in msg){
            if(msg.hasOwnProperty(item)){
                $.util.log(util.colors.blue(msg[item]));
            }
        }
    }else{
        $.util.log($.util.colors.blue(msg));
    }
};

gulp.task('vet', ()=>{
    log('Analyzing Javascript code...');
    return gulp.src(config.paths.js)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('default', {verbose:true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('reload-html', ()=>{
    gulp.src(config.paths.html)
        .pipe($.connect.reload());
});

gulp.task('reload-css', ()=>{
    gulp.src(config.paths.css)
        .pipe($.connect.reload());
});

gulp.task('reload-js', ()=>{
    gulp.src(config.paths.js)
        .pipe($.connect.reload());
});

gulp.task('watch', ()=>{
    gulp.watch(config.paths.html, ['reload-html']);
    gulp.watch(config.paths.css, ['reload-css']);
    gulp.watch(config.paths.js, ['reload-js']);
});

gulp.task('inject', ()=>{
    return gulp.src(config.paths.index)
        .pipe($.inject(es.merge(
            gulp.src(config.paths.css, {read: false}),
            gulp.src(config.paths.js)
        ), {relative: true}))
        .pipe(gulp.dest('./'));
})

gulp.task('inject-vendor', ()=>{
    gulp.src(config.paths.index)
        .pipe(wiredep({}))
        .pipe(gulp.dest('./'));
})

gulp.task('copy-html', ()=>{
    log('Copying HTML files...');
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dev));
})

gulp.task('copy-css', ()=>{
    log('Copying CSS files...');
    gulp.src(config.paths.css)
        .pipe(gulp.dest(config.paths.dev+'styles/'));
})

gulp.task('copy-js', ()=>{
    log('Copying JS files...');
    gulp.src(config.paths.js)
        .pipe(gulp.dest(config.paths.dev));
})

gulp.task('copy-app', ()=>{
    log('Copying application files...');
    gulp.src(config.paths.app)
        .pipe(gulp.dest(config.paths.dev+'app/'));
})

gulp.task('clean', (callback)=>{
    log('Cleaning: '+$.util.colors.blue(path));
    del(config.paths.dev,callback);
})


gulp.task('serve-dev', ['connect','watch']);
gulp.task('inject-all', ['inject', 'inject-vendor']);
gulp.task('default', ['serve-dev']);

const clean = (path)=>{
    log('Cleaning: '+$.util.colors.blue(path));
    del(path);
}

