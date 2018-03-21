const gulp = require("gulp"),
  //critical = require('critical'),
  $ = require("gulp-load-plugins")();
//workbox = require('workbox-build');
/*let criticalPageToProcess = "index";
criticalPageToProcess = "restaurant";
gulp.task('critical', function(cb) {
    critical.generate({
        base: '/home/ubuntu/workspace/',
        src: `${criticalPageToProcess}.html`,
        css: ['css/styles.css'],
        dimensions: [{
            width: 320,
            height: 480
        }, {
            width: 768,
            height: 1024
        }, {
            width: 1280,
            height: 960
        }],
        dest: `css/dist/critical.${criticalPageToProcess}.css`,
        minify: true,
        extract: false
    });
});*/
gulp.task("images", function() {
  return gulp
    .src("img/*.{jpg,png}")
    .pipe(
      $.responsive(
        {
          // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
          "*.jpg": [
            { width: 64, rename: { suffix: "-64w" } },
            { width: 128, rename: { suffix: "-128w" } },
            { width: 400, rename: { suffix: "-400w" } },
            { width: 500, rename: { suffix: "-500w" } },
            {
              // Compress, strip metadata, and rename original image //used for the index.html across all viewports // //used for the index.html across all viewports
              rename: { suffix: "-better-original" }
            }
          ] /*,
        // Resize all PNG images to be retina ready
        '*.png': [{
            width: 250,
        }, {
            width: 250 * 2,
            rename: {
                suffix: '@2x'
            },
        }],*/
        },
        {
          // Global configuration for all images
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          progressive: true,
          withMetadata: false
        }
      )
    ) // Use progressive (interlace) scan for JPEG and PNG output // Strip all metadata
    .pipe(gulp.dest("img/dist"));
});
/*gulp.task('generate-service-worker', () => {
    return workbox.generateSW({
        globDirectory: dist,
        globPatterns: ['**\/*.{html,js}'],
        swDest: `${dist}/sw.js`,
        clientsClaim: true,
        skipWaiting: true
    }).then(() => {
        console.info('Service worker generation completed.');
    }).catch((error) => {
        console.warn('Service worker generation failed: ' + error);
    });
});*/

//https://stackoverflow.com/a/28460016
gulp.task("default", ["images"]);
