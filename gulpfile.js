/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const gulp = require(`gulp`);
const del = require(`del`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const concat = require(`gulp-concat`);
const rename = require(`gulp-rename`);
const newer = require(`gulp-newer`);
const imagemin = require(`gulp-imagemin`);
const svgstore = require(`gulp-svgstore`);
const webp = require(`gulp-webp`);
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const rollup = require(`gulp-better-rollup`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);

const uglify = require(`gulp-terser`);

const server = require(`browser-sync`).create();

gulp.task(`clean`, function () {
  return del(`build`);
});

gulp.task(`copy`, function () {
  return gulp.src([
    `source/fonts/**`
  ], {
    base: `source`
  })
    .pipe(gulp.dest(`build`));
});

// СТИЛИ
gulp.task(`css`, function () {
  return gulp.src(`source/scss/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: `expanded`
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(`build/css`))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(server.stream());
});

// ИЗОБРАЖЕНИЯ
gulp.task(`sprite`, function () {
  return gulp.src(`source/img/*.svg`)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`webp`, function () {
  return gulp.src(`build/img/*.{png,jpg,gif}`)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`images`, function () {
  return gulp.src(`source/img/**/*.{png,jpg,svg,gif}`)
    .pipe(newer(`build/img`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`imagemin`, function () {
  return gulp.src(`build/img/**/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false,
          removeUselessStrokeAndFill: false
        }]
      })
    ]))
    .pipe(gulp.dest(`build/img`));
});

// СКРИПТЫ
gulp.task(`js-vendor`, function () {
  return gulp.src([
    `source/js/vendor/*.js`,
  ])
    .pipe(plumber())
    .pipe(concat(`vendor.js`))
    .pipe(gulp.dest(`build/js`))
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest(`build/js`));
});

gulp.task(`js`, function () {
  return gulp.src([
    `source/js/main.js`,
  ])
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(rollup({}, `iife`))
    // .pipe(gulp.dest(`build/js`))
    // .pipe(uglify())
    // .pipe(rename({
    //   suffix: `.min`
    // }))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/js`));
});

// HTML
gulp.task(`html`, function () {
  return gulp.src(`source/*.html`)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(`build`));
});

// СТРИМ
gulp.task(`server`, function () {
  server.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`source/scss/**/*.scss`, gulp.series(`css`));
  gulp.watch(`source/img/**/*`, gulp.series(`images`, `sprite`, `webp`, `refresh`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`js`, `js-vendor`, `refresh`));
  gulp.watch(`source/*.html`).on(`change`, gulp.series(`html`, `refresh`));
});

gulp.task(`refresh`, function (done) {
  server.reload();
  done();
});

// СБОРКА И СТАРТ
gulp.task(`build`, gulp.series(`clean`, `copy`, `images`, `webp`, `imagemin`, `sprite`, `css`, `js-vendor`, `js`, `html`));
gulp.task(`start`, gulp.series(`build`, `server`));
