3.0.6 / 10.03.2026
==================

* Fixed a [bug](https://gitlab.com/catamphetamine/write-excel-file/-/issues/110) when on Windows a new sheet couldn't be created when opening the file in Excel with error message "This command cannot be used on multiple selections". On MacOS the error when attempting to copy spreadsheet data was: "This action won't work on multiple selections".

* Added a new subpackage `write-excel-file/utility` that exports some utility functions for use in custom "features".

3.0.0 / 23.02.2026
==================

* Refactored the code.
* (breaking change) The minimum required Node.js version is now >= 18.
* (breaking change) The default export has been removed in order to not confuse people.
* (breaking change) `/browser` export uses [Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) now to avoid blocking the main thread. I dunno if Internet Explorer is supported now.
* Added new exports: `/browser` and `/universal`.
	* `/universal` works both in a web browser and Node.js. Only outputs a [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob).
	* `/browser` works in a web browser. It replaced what used to be the default export. It also replaces [`jszip`](https://www.npmjs.com/package/jszip) dependency with [`fflate`](https://www.npmjs.com/package/fflate) because they claim it to be fast and small. It also removes [`file-saver`](https://www.npmjs.com/package/file-saver) dependency replacing it with a simple function.
	* `/node` stayed the same but replaced [`archiver`](https://www.npmjs.com/package/archiver) with a fork called [`archiver-node`](https://npmjs.org/package/archiver-node) that fixes a few of issues in `archiver` package.
	<!-- * The default export stayed the same. It's basically same as `/browser` but still uses [`jszip`](https://www.npmjs.com/package/jszip) instead of [`fflate`](https://www.npmjs.com/package/fflate). -->
<!-- * Added `blob: true` option to `/node` subpackage. It outputs a [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob). -->
* (breaking change) Renamed cell property `color` to `textColor`.
* (breaking change) Removed `headerStyle` parameter. Pass `getHeaderStyle()` parameter instead.
* (breaking change) `images[]` parameter no longer accepts string values (i.e. file paths). Instead, use `fs.createReadStream(filePath)` function to convert file paths to `Stream`s.
* Added a system of custom `features` which allows writing "plug-ins" for making custom changes in the resulting `.xlsx` file. To use it, pass a new `features: Feature[]` parameter. See readme for more details.
* Added "conditional formatting" feature. Pull request was [submitted](https://github.com/catamphetamine/write-excel-file/pull/10) by [Isaac Laquerre](https://github.com/IsaacLaquerre).
* Added `zoomScale` option. Pull request was [submitted](https://github.com/catamphetamine/write-excel-file/pull/10) by [Isaac Laquerre](https://github.com/IsaacLaquerre).
* Fixed a bug when all sheets' tabs were displayed as highlighted rather than just the initially-selected sheet's tab. This also avoids UI bugs such as certain buttons being disabled until one of the sheets' tabs is manually selected by the user. Pull request was [submitted](https://github.com/catamphetamine/write-excel-file/pull/10) by [Isaac Laquerre](https://github.com/IsaacLaquerre).

2.3.3 / 25.07.2025
==================

* Merged a [pull request](https://gitlab.com/catamphetamine/write-excel-file/-/merge_requests/6) by
[Daniel Bly](https://gitlab.com/dan672) that removes an incorrect `t="f"` attribute from `<c>`ells of type "Formula".

2.3.0 / 23.02.2025
==================

* Added `images` feature. The original [pull request](https://gitlab.com/catamphetamine/write-excel-file/-/merge_requests/5) was submitted by [@Monotoby](https://gitlab.com/Miniontoby).

2.0.11 / 16.01.2025
==================

* Added a `getCellStyle(object)` function in cases when using a `schema`. This allows setting different style for different rows when using a `schema`.

2.0.6 / 16.08.2024
==================

* Added [cell indentation](https://github.com/catamphetamine/write-excel-file/issues/4) parameter: `indent?: number`.

2.0.3 / 30.05.2024
==================

* Merged a [pull request](https://gitlab.com/catamphetamine/write-excel-file/-/merge_requests/2) by
[Waldir Denver](https://gitlab.com/wdenver2007) that adds `showGridLines: false` option.

2.0.0 / 06.05.2024
==================

* Updated `archiver` module to [remove Node.js warning](https://gitlab.com/catamphetamine/write-excel-file/-/issues/85). That drops support for Node.js =< 12.

1.4.28 / 17.01.2024
==================

* Merged a [pull request](https://github.com/catamphetamine/write-excel-file/pull/7) by @AlexisLeite that adds `textRotation` parameter.

1.4.0 / 18.05.2022
==================

* Migrated to [ES Modules](https://gitlab.com/catamphetamine/read-excel-file/-/issues/44) exports.

1.3.16 / 17.02.2022
==================

* Fixed [whitespace getting trimmed](https://gitlab.com/catamphetamine/write-excel-file/-/issues/19) in cell values.

1.3.10 / 16.12.2021
==================

* Added `orientation: "landscape"` parameter.

1.3.8 / 24.11.2021
==================

* Added `fontStyle: "italic"` parameter.

1.3.5 / 27.10.2021
==================

* Added `sheet` name parameter.

* Added cell value `type` autodetection (only when not using a `schema`).

* Used the [propositions](https://gitlab.com/catamphetamine/write-excel-file/-/issues/4) from `@Antal.Bukos` and `@logistiview_lhoward` to fix TypeScript "typings".

1.3.4 / 08.10.2021
==================

* Fixed `columns` parameter when passing a `sheets` parameter when writing multiple sheets.

* Added TypeScript definitions.

1.3.3 / 04.08.2021
==================

* [Fixed](https://gitlab.com/catamphetamine/write-excel-file/-/issues/1) escaping quotes.

1.3.0 / 01.08.2021
==================

* Added row height option.

* Added column `span` and `rowSpan` options.

* Added `borderColor` and `borderStyle` options. Also the options for top / left / bottom / right border.

1.2.0 / 30.07.2021
==================

* Added support for generating `*.xlsx` files with multiple sheets.

1.1.2 / 04.07.2021
==================

* Added a global `dateFormat` configuration parameter (when using a `schema`).

1.1.1 / 24.06.2021
==================

* Added `headerStyle` property (when using a `schema`).

1.1.0 / 23.06.2021
==================

* Added `color`, `backgroundColor`, `alignVertical` and `wrap` properties.

* Added `fontFamily` and `fontSize` parameters.

1.0.3 / 18.06.2021
==================

* Fixed opening the generated `*.xlsx` files in MS Office 2007 Excel.

* Added `align` attribute.

1.0.0 / 17.06.2021
==================

* Initial release