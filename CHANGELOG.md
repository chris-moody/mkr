# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.4.3"></a>
## [0.4.3](https://github.com/chris-moody/mkr/compare/v0.4.2...v0.4.3) (2017-05-27)


### Bug Fixes

* **mks, clp, grdnt:** Prevent defs-based svg construct from creating extra svg elements ([1c6924d](https://github.com/chris-moody/mkr/commit/1c6924d))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/chris-moody/mkr/compare/v0.4.1...v0.4.2) (2017-05-26)


### Bug Fixes

* **svg constructs:** Prevent svg constructs from unnecessarily create svg element ([3f93b4d](https://github.com/chris-moody/mkr/commit/3f93b4d))


### Features

* **arc:** Add r property for circular control ([f2c3f9a](https://github.com/chris-moody/mkr/commit/f2c3f9a))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/chris-moody/mkr/compare/v0.4.0...v0.4.1) (2017-05-25)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/chris-moody/mkr/compare/v0.3.2...v0.4.0) (2017-05-25)


### Features

* **arc:** add convenience methods and properties ([603ceab](https://github.com/chris-moody/mkr/commit/603ceab))
* **grdnt:** Add new convenience methods and properties ([eaba1ac](https://github.com/chris-moody/mkr/commit/eaba1ac))
* **svg constructs:** New SVG circle construct ([12d18e3](https://github.com/chris-moody/mkr/commit/12d18e3))
* **svg constructs:** New SVG construct for drawing regular polygons ([aae8781](https://github.com/chris-moody/mkr/commit/aae8781))
* **svg constructs:** New SVG construct for drawing stars ([8e01c79](https://github.com/chris-moody/mkr/commit/8e01c79))
* **svg constructs:** New SVG ellipse construct ([86f2625](https://github.com/chris-moody/mkr/commit/86f2625))
* **svg constructs:** New SVG line construct ([edfc483](https://github.com/chris-moody/mkr/commit/edfc483))
* **svg constructs:** New SVG polyline construct ([349bcac](https://github.com/chris-moody/mkr/commit/349bcac))
* **svg constructs:** New SVG rect construct ([a3e574b](https://github.com/chris-moody/mkr/commit/a3e574b))
* **svg constructs:** Reworked arc construct ([eadceec](https://github.com/chris-moody/mkr/commit/eadceec))
* **svg constructs:** Reworked drw construct ([446ce17](https://github.com/chris-moody/mkr/commit/446ce17))
* **svg constructs:** Update clp construct ([46d222d](https://github.com/chris-moody/mkr/commit/46d222d))
* **svg constructs:** Update grdnt construct ([6003974](https://github.com/chris-moody/mkr/commit/6003974))
* **svg constructs:** Update msk construct ([c9d74fe](https://github.com/chris-moody/mkr/commit/c9d74fe))
* **svg constructs:** Update plygn construct ([037807d](https://github.com/chris-moody/mkr/commit/037807d))


### BREAKING CHANGES

* **svg constructs:** .svg -> .parent
* **svg constructs:** .svg -> .parent, .addMask() -> .create(), addTargets() -> .assign()
* **svg constructs:** .svg -> .parent, .addClip() -> .create(), addTargets() -> .assign()
* **svg constructs:** .svg -> .parent
* **svg constructs:** .svg -> .parent, removed: .lineTo(), .arcTo(), .newPath()
* **svg constructs:** .svg -> .parent, .calculatePath(cx, cy, r...) -> .calculatePath(cx, cy, rx, ry...)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/chris-moody/mkr/compare/v0.3.1...v0.3.2) (2017-05-07)


### Bug Fixes

* **constructs:** Bug fixes... time to write tests for constructs ([8e7ce9d](https://github.com/chris-moody/mkr/commit/8e7ce9d))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/chris-moody/mkr/compare/v0.3.0...v0.3.1) (2017-05-06)


### Bug Fixes

* **mkr.reveal:** Fix infinite loop ([8462fba](https://github.com/chris-moody/mkr/commit/8462fba))
* **mkr.scroll:** Fix mkr.scroll to factor current scroll position ([a58e2c4](https://github.com/chris-moody/mkr/commit/a58e2c4))


### Features

* **constructs:** Add full and minified constructs to dist ([ae9a37f](https://github.com/chris-moody/mkr/commit/ae9a37f))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/chris-moody/admkr/compare/v0.2.27...v0.3.0) (2017-04-08)
