/**
 * Requires that a function expression be anonymous.
 *
 * Type: `Boolean`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *    - `'allExcept'` array of exceptions:
 *       - `'functionDeclarations'` ignores function declarations
 *
 * #### Example
 *
 * ```js
 * "requireAnonymousFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = function(){
 *
 * };
 *
 * $('#foo').click(function(){
 *
 * })
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = function foo(){
 *
 * };
 *
 * $('#foo').click(function bar(){
 *
 * });
 * ```
 *
 * ##### Valid for `{"allExcept": ["functionDeclarations"]}`
 *
 * ```js
 * function foo() {
 *
 * }
 *
 * $('#foo').click(function(){
 *
 * })
 * ```
 *
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
                options === true,
                this.getOptionName() + ' option requires either a true value or an object'
            );

            var _options = {allExcept: []};
            return this.configure(_options);
        }

        if (Array.isArray(options.allExcept)) {
            this._exceptFunctionDeclarations = options.allExcept.indexOf('functionDeclarations') > -1;
        }
    },

    getOptionName: function() {
        return 'requireAnonymousFunctions';
    },

    check: function(file, errors) {
        var exceptFunctionDeclarations = this._exceptFunctionDeclarations;

        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (exceptFunctionDeclarations && node.type === 'FunctionDeclaration') {
                return;
            }
            if (node.id !== null) {
                errors.add('Functions must not be named', node.loc.start);
            }
        });
    }
};
