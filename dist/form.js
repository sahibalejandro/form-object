'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _objectToFormdata = require('object-to-formdata');

var _objectToFormdata2 = _interopRequireDefault(_objectToFormdata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = function () {
    /**
     * Constructor
     *
     * @return {Form}
     */
    function Form() {
        var _this = this;

        _classCallCheck(this, Form);

        this.progress = 0;
        this.isPending = false;
        this.errors = new _errors2.default();

        // Create shorcut methods
        ['post', 'patch', 'put', 'delete'].forEach(function (method) {
            _this[method] = function (url, data) {
                return _this.submit(method, url, data);
            };
        });
    }

    /**
     * Submit the form to the given URL using the method specified.
     *
     * @param  {String} method
     * @param  {String} url
     * @param  {Object} data
     * @return {Promise}
     */


    _createClass(Form, [{
        key: 'submit',
        value: function submit(method, url) {
            var _this2 = this;

            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            this.progress = 0;
            this.errors.clear();
            this.isPending = true;

            return new Promise(function (resolve, reject) {
                Form.defaults.axios[method.toLowerCase()](url, _this2.formData(data), _this2.config()).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    _this2.handleError(error);
                    reject(error);
                }).then(function () {
                    return _this2.isPending = false;
                });
            });
        }

        /**
         * Get a FormData instance from the given data object, if class FormData is
         * not available the original data object is returned.
         *
         * @param  {Object} data
         * @return {FormData|Object}
         */

    }, {
        key: 'formData',
        value: function formData(data) {
            if (typeof FormData === 'undefined') {
                return data;
            }

            return (0, _objectToFormdata2.default)(data);
        }

        /**
         * Make a POST or PATCH request depending on whether the resource has an id
         * property.
         *
         * @param  {String} url
         * @param  {Object} resource
         * @return {Promise}
         */

    }, {
        key: 'save',
        value: function save(url, resource) {
            var method = 'post';

            if (resource.hasOwnProperty('id')) {
                method = 'patch';
                url = this.urlToPatchResource(url, resource);
            }

            return this[method](url, resource);
        }

        /**
         * Return the URL to patch a resource.
         *
         * @param  {String} url
         * @param  {Object} resource
         * @return {String}
         */

    }, {
        key: 'urlToPatchResource',
        value: function urlToPatchResource(url, resource) {
            return url.replace(/\/+$/, '') + '/' + resource.id;
        }

        /**
         * Returns the configuration object to use in the next request.
         *
         * @return {Object}
         */

    }, {
        key: 'config',
        value: function config() {
            var _this3 = this;

            return {
                onUploadProgress: function onUploadProgress(progressEvent) {
                    _this3.progress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                }
            };
        }

        /**
         * Handle a error response.
         *
         * @param  {Object} response
         * @return {Boolean}
         */

    }, {
        key: 'handleError',
        value: function handleError(response) {
            if (response.response && response.response.status === 422) {

                // Laravel >= 5.5 wraps the errors inside an "errors" object.
                var errors = response.response.data.hasOwnProperty('errors') ? response.response.data.errors : response.response.data;

                this.errors.set(errors);
            }
        }
    }]);

    return Form;
}();

;

/*
 * Expose default values in order to let users customize behavior.
 */
Form.defaults = { axios: _axios2.default };

module.exports = Form;