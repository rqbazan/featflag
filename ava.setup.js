/**
 * https://testing-library.com/docs/setup#using-without-jest
 * https://github.com/jsdom/jsdom/pull/2458/files
 */
require('jsdom-global')('', { runScripts: 'outside-only' })
