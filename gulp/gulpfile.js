const { src, dest, watch, series, parallel } = require("gulp"); // Gulpの基本関数をインポート
const path = require("path"); // パス操作のためのモジュール
const sass = require("gulp-sass")(require("sass")); // SCSSをCSSにコンパイルするためのモジュール
const plumber = require("gulp-plumber"); // エラーが発生してもタスクを続行するためのモジュール
const notify = require("gulp-notify"); // エラーやタスク完了の通知を表示するためのモジュール
const sassGlob = require("gulp-sass-glob-use-forward"); // SCSSのインポートを簡略化するためのモジュール
const mmq = require("gulp-merge-media-queries"); // メディアクエリをマージするためのモジュール
const postcss = require("gulp-postcss"); // CSSの変換処理を行うためのモジュール
const autoprefixer = require("autoprefixer"); // ベンダープレフィックスを自動的に追加するためのモジュール
const cssdeclsort = require("css-declaration-sorter"); // CSSの宣言をソートするためのモジュール
const postcssPresetEnv = require("postcss-preset-env"); // 最新のCSS構文を使用可能にするためのモジュール
const rename = require("gulp-rename"); // ファイル名を変更するためのモジュール
const sourcemaps = require("gulp-sourcemaps"); // ソースマップを作成するためのモジュール
const babel = require("gulp-babel"); // ES6+のJavaScriptをES5に変換するためのモジュール
const uglify = require("gulp-uglify"); // JavaScriptを圧縮するためのモジュール
const imageminSvgo = require("imagemin-svgo"); // SVGを最適化するためのモジュール
const browserSync = require("browser-sync"); // ブラウザの自動リロード機能を提供するためのモジュール
const imagemin = require("gulp-imagemin"); // 画像を最適化するためのモジュール
const imageminMozjpeg = require("imagemin-mozjpeg"); // JPEGを最適化するためのモジュール
const imageminPngquant = require("imagemin-pngquant"); // PNGを最適化するためのモジュール
const changed = require("gulp-changed"); // 変更されたファイルのみを対象にするためのモジュール
const del = require("del"); // ファイルやディレクトリを削除するためのモジュール
const webp = require("gulp-webp"); //webp変換
const pixrem = require("pixrem");
// 2023/09/08 style.css.map に対応する
const combineMq = require("postcss-combine-media-query");
const ejs = require("gulp-ejs");
const replace = require("gulp-replace");
const htmlbeautify = require("gulp-html-beautify");
const srcEjsDir = "../src/ejs";
const fs = require("fs"); //JSONファイル操作用
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const named = require("vinyl-named");

// Define paths
const paths = {
  src: {
    json: "../src/ejs/**/*.json",
    css: "../src/sass/**/*.scss",
    js: "../src/js/**/*",
    img: "../src/images/**/*",
    ejs: "../src/ejs/**/*.ejs",
    html: ["../src/**/*.html", "!../src/node_modules/**"],
    rt: "../src/root/**/*",
  },
  dest: {
    all: "../dist/**/*",
    css: "../dist/assets/css/",
    js: "../dist/assets/js/",
    img: "../dist/assets/images/",
    html: "../dist/",
  }
};

// Define browser support
const browsers = [
  "last 2 versions",
  "> 1%",
  "not dead",
  "not ie 11",
];

// Compile Sass
const compileSass = () => {
  return src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(plumber({ errorHandler: notify.onError("Error:<%= error.message %>") }))
    .pipe(sassGlob())
    .pipe(sass.sync({ includePaths: ["src/sass"], outputStyle: "expanded" }))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: browsers })]))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(paths.dest.css))
    .pipe(notify({ message: "Sassをコンパイルしました！", onLast: true }));
};

// Compile EJS
const compileEjs = (done) => {
  const jsonFile = "../src/ejs/pageData/pageData.json";
  const json = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  src([paths.src.ejs, "!../src/ejs/**/_*.ejs"])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(ejs({ json: json }))
    .pipe(rename({ extname: ".html" }))
    .pipe(replace(/^(?!.*GTM-PW9R494W)[ \t]*\n/gm, ""))
    .pipe(htmlbeautify({
      indent_size: 2,
      indent_char: " ",
      max_preserve_newlines: 0,
      preserve_newlines: false,
      extra_liners: [],
      unformatted: ['script']
    }))
    .pipe(dest(paths.dest.html));
  done();
};

// Optimize Images
const optimizeImages = () => {
  return src(paths.src.img)
    .pipe(changed(paths.dest.img))
    .pipe(imagemin([
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant(),
      imageminSvgo({ plugins: [{ removeViewbox: false }] })
    ], { verbose: true }))
    .pipe(dest(paths.dest.img))
    .pipe(webp())
    .pipe(dest(paths.dest.img));
};

// Bundle JavaScript
const bundleJs = () => {
  return src(paths.src.js)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(named())
    .pipe(webpackStream({
      mode: "development",
      devtool: "source-map",
      entry: { index: "../src/js/index.js" },
      output: { filename: "bundle.js" },
      module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } } },
          { test: /\.css$/, use: ["style-loader", "css-loader"] }
        ]
      },
      resolve: { extensions: [".js"], modules: ["node_modules", path.resolve(__dirname, "node_modules")] }
    }))
    .pipe(dest(paths.dest.js));
};

// Copy root files
const copyRootFiles = () => {
  return src(paths.src.rt).pipe(dest(paths.dest.html)); // destPath.htmlは'dist/'を指しています。
};

// BrowserSync
const browserSyncOption = { notify: false, server: "../dist/" };
const browserSyncFunc = () => browserSync.init(browserSyncOption);
const browserSyncReload = (done) => { browserSync.reload(); done(); };

// Clean output directory
const clean = () => del([paths.dest.all], { force: true });

// Watch files
const watchFiles = () => {
  watch(paths.src.css, series(compileSass, browserSyncReload));
  watch(paths.src.js, series(bundleJs, browserSyncReload));
  watch(paths.src.img, series(optimizeImages, browserSyncReload));
  watch(paths.src.ejs, series(compileEjs, browserSyncReload));
  watch(paths.src.rt, series(copyRootFiles, browserSyncReload));
};

// Export tasks
exports.default = series(
  series(compileSass, bundleJs, optimizeImages, compileEjs, copyRootFiles),
  parallel(watchFiles, browserSyncFunc)
);
exports.build = series(clean, compileSass, bundleJs, optimizeImages, compileEjs, copyRootFiles);
exports.jsWebpack = bundleJs;
