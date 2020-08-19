const
	destination = './docs/',
	gulp = require('gulp'),
	minify = require('gulp-minifier'),
	imagemin = require('gulp-imagemin'),
	shell = require('child_process').exec
;


function reset() {
	return shell(`npx del-cli ${destination}`);
}

function eleventy() {
	return shell(`npx @11ty/eleventy --output="${destination}"`);
}

function cname() {
	return gulp.src('./CNAME')
		.pipe(gulp.dest(destination));
}

function redirect() {
	return gulp.src('./.netlify/_redirects')
		.pipe(gulp.dest(destination));
}

function html() {
	return gulp.src(destination + '**/*.html')
	.pipe(minify({
		minify: true,
		minifyHTML: {
			collapseBooleanAttributes: true,
			collapseInlineTagWhitespace: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			minifyCSS: true,
			minifyJS: true,
			preserveLineBreaks: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true
		}
	}))
	.pipe(gulp.dest(destination));
}

function css() {
	return shell(`npx sass site/scss:${destination}css --style=compressed --no-source-map`);
}

function js() {
	return Promise.all([
		gulp.src(['./site/js/**/*.js', '!./site/js/**/serviceworker.js'])
			.pipe(minify({
				minify: true,
				minifyJS: {}
			}))
			.pipe(gulp.dest(destination + 'js/')),

		gulp.src(['./site/js/**/serviceworker.js'])
			.pipe(minify({
				minify: true,
				minifyJS: {}
			}))
			.pipe(gulp.dest(destination)),

		gulp.src(['./site/js/**', '!./site/js/**/*.js'])
			.pipe(gulp.dest(destination + 'js/'))
	]);
}

function img() {
	return gulp.src('./site/img/**')
	.pipe(imagemin([
		imagemin.gifsicle(),
		imagemin.mozjpeg(),
		imagemin.optipng(),
		imagemin.svgo({plugins: [{removeViewBox: false}]})
	]))
	.pipe(gulp.dest(destination + 'img/'));
}

function netlify() {
	return shell(`netlify deploy --dir=${destination} --prod`);
}

function browser() {
	return shell('start firefox.exe -private-window https://jkc-codes.netlify.app');
}


exports.default = gulp.series(
	reset,
	gulp.parallel(
		cname,
		redirect,
		gulp.series(
			eleventy,
			html
		),
		css,
		js,
		img
	),
	netlify,
	gulp.parallel(
		browser,
		reset
	)
);

exports.publish = gulp.series(
	reset,
	gulp.parallel(
		cname,
		gulp.series(
			eleventy,
			html
		),
		css,
		js,
		img
	)
);