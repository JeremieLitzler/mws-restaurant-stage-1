const gulp = require("gulp"),
  $ = require("gulp-load-plugins")();
gulp.task("default", () =>
  gulp
    .src("src/*.css")
    .pipe(rev())
    .pipe(gulp.dest("dist"))
);
gulp.task("images", function() {
  return gulp
    .src("assets/img/*.{jpg,png}")
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
          ]
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
    .pipe(gulp.dest("build/img"));
});

//https://stackoverflow.com/a/28460016
gulp.task("default", ["images"]);
