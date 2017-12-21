const gulp = require("gulp");
const ts = require("gulp-typescript");
const jeditor = require("gulp-json-editor");
const del = require("del");

const project = ts.createProject("tsconfig.json");
const OUT_DIR = project.options.outDir;

// clean build dir
gulp.task("clean", () => del(["bin"]));

// transpile project to JS using tsconfig.json
gulp.task("compile", ["clean"], () => {
  project
    .src()
    .pipe(project())
    .pipe(gulp.dest(OUT_DIR));
});

// remove source utils from package and copies it to dist folder
gulp.task("edit-package", ["clean"], () => {
  gulp
    .src("./package.json")
    .pipe(
      jeditor(json => {
        json.main = "index.js";
        delete json.scripts;
        delete json.devDependencies;
        return json;
      })
    )
    .pipe(gulp.dest(OUT_DIR));
});

gulp.task("copy-readme", ["clean"], () => {
  gulp.src("./readme.md").pipe(gulp.dest(OUT_DIR));
});

gulp.task("default", ["clean", "compile", "edit-package", "copy-readme"]);
