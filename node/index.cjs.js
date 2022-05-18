// This file is deprecated.
// It fixes the issue when some software doesn't see files with `*.cjs` file extensions
// when used as the `main` property value in `package.json`.

exports = module.exports = require('../commonjs/write/writeXlsxFileNode.js').default
exports['default'] = require('../commonjs/write/writeXlsxFileNode.js').default
// exports.Integer = require('../commonjs/types/Integer.js').default
// exports.Email = require('../commonjs/types/Email.js').default
// exports.URL = require('../commonjs/types/URL.js').default