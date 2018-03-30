const gulp = require("gulp");
const ejs = require("gulp-ejs-monster");
const htmlbeautify = require('gulp-html-beautify');
const webpackStream = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const argv = require('yargs').argv;
const postcss = require('gulp-postcss');
const rimraf = require('rimraf');

const postcssPlugins = require('./postcss.config.js');

process.env.webpackWatch = argv.production;

const options = {
    ejs: {
        templates: './app/templates/*.ejs',
        layouts: './app/layouts/',
        modules: './app/modules/',
        watch: './app/**/*.ejs'
    },
    js: {
        entry:   './app/app.js',
        watch: './app/js/**/*.js'
    },
    styles: {
        entry: './app/styles/app.css',
        glob: './app/styles/**/*.css',
        watch: './app/styles/**/*.css',
    },
    images: {
        glob: './app/images/*',
        watch: './app/images/*',
    },
    icons: {
        glob: './app/icons/*.svg',
        watch: './app/icons/*.svg',
    },
    files: {
        glob: './app/files/**',
        watch: './app/files/**',
    },
    dist: {
        ejs: './assets',
        js: './assets/js',
        styles: './assets/css',
        images: './assets/images',
        icons: './assets/icons',
        files: './assets/files',
        htmlFrom: 'assets/**',
        htmlTo: '../../../../html/',
    },
    production: process.env.webpackWatch,
    clean: './assets'
};

gulp.task('ejs', function(){
    return gulp.src(options.ejs.templates)
        .pipe(ejs({
            layouts: options.ejs.layouts,
            requires: options.ejs.modules,
            includes: 'app/'
        }).on('error', ejs.preventCrash))
        .pipe(htmlbeautify({indentSize: 4}))
        .pipe(gulp.dest(options.dist.ejs))
});

gulp.task('ejs:watch', function () {
    gulp.watch(options.ejs.templates, ['ejs']);
});

gulp.task('images', function () {
    return gulp.src(options.images.glob)
        .pipe(gulp.dest(options.dist.images))
});

gulp.task('images:watch', function () {
    gulp.watch(options.images.glob, ['images']);
});

gulp.task('images:minify', function () {
    return gulp.src(options.images.glob)
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist.images))
});

gulp.task('files', function () {
    return gulp.src(options.files.glob)
        .pipe(gulp.dest(options.dist.files))
});

gulp.task('icons', function () {
    return gulp.src(options.icons.glob)
        .pipe(svgSprite({
            mode				: {
                symbol			: {
                    prefix: ''
                },
            },
            svg						: {							// General options for created SVG files
                xmlDeclaration		: false,						// Add XML declaration to SVG sprite
                namespaceIDs		: false,						// Add namespace token to all IDs in SVG shapes
                doctypeDeclaration	: false,						// Add DOCTYPE declaration to SVG sprite
                namespaceClassnames	: false,						// Add namespace token to all CSS class names in SVG shapes
                dimensionAttributes	: true						// Width and height attributes on the sprite
            },
            shape				: {
                id				: {
                    generator: 'icon-%s',
                }
                }
            }))
        .pipe(gulp.dest(options.dist.icons))
});

gulp.task('webpack', function() {
    process.env.webpackWatch = false;

    return gulp.src(options.js.entry)
        .pipe(webpackStream( require('./webpack.config.js') ))
        .pipe(gulp.dest(options.dist.js));
});

gulp.task('styles', function () {
    return gulp.src(options.styles.entry)
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(options.dist.styles));
});

gulp.task('styles:watch', function () {
    gulp.watch(options.styles.glob, ['styles']);
});

gulp.task('webpack:watch', function() {
    process.env.webpackWatch = true;

    return gulp.src(options.js.entry)
        .pipe(webpackStream( require('./webpack.config.js') ))
        .pipe(gulp.dest(options.dist.js));
});

gulp.task('moveHtmlFolder:build', function () {
    return gulp.src(options.dist.htmlFrom)
        .pipe(gulp.dest(options.dist.htmlTo))
});

gulp.task('clean', function (cb) {
    return rimraf(options.clean, cb);
});

// TODO: сделать вотчеры по gulp 4

gulp.task('build:watch', function() {
    gulp.watch(options.ejs.watch, gulp.series('ejs'));
    gulp.watch(options.js.watch, gulp.series('webpack'));
    gulp.watch(options.styles.watch, gulp.series('styles'));
});

gulp.task('build', gulp.series('ejs', 'styles', 'webpack', 'images', 'icons', 'files'));

gulp.task('default', gulp.series('build'));