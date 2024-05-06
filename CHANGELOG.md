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