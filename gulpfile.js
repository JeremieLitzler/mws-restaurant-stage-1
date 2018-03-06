var gulp = require("gulp");
var $ = require("gulp-load-plugins")();

gulp.task("images", function() {
  return gulp
    .src("img/*.{jpg,png}")
    .pipe(
      $.responsive(
        {
          // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
          "*.jpg": [
            {
              width: 100,
              rename: { suffix: "-100" }
            },
            {
              width: 200,
              rename: { suffix: "-200" }
            },
            {
              width: 600,
              rename: { suffix: "-400" }
            },
            {
              // Compress, strip metadata, and rename original image
              rename: { suffix: "-original-no-metadata" }
            }
          ],
          // Resize all PNG images to be retina ready
          "*.png": [
            {
              width: 250
            },
            {
              width: 250 * 2,
              rename: { suffix: "@2x" }
            }
          ]
        },
        {
          // Global configuration for all images
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          // Use progressive (interlace) scan for JPEG and PNG output
          progressive: true,
          // Strip all metadata
          withMetadata: false
        }
      )
    )
    .pipe(gulp.dest("dist/img"));
});
