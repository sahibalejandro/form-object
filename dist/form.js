'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {

    /**
     * Constructor
     *
     * @return {Form}
     */
    function _class() {
        var _this = this;

        _classCallCheck(this, _class);

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


    _createClass(_class, [{
        key: 'submit',
        value: function submit(method, url) {
            var _this2 = this;

            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            this.progress = 0;
            this.errors.clear();
            this.isPending = true;

            return new Promise(function (resolve, reject) {
                _axios2.default[method.toLowerCase()](url, _this2.formData(data), _this2.config()).then(function (response) {
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
         * Return true if some field in data object is a File object.
         *
         * @param  {Object} data
         * @return {Boolean}
         */

    }, {
        key: 'hasFiles',
        value: function hasFiles(data) {
            for (var prop in data) {
                if (data[prop] instanceof File) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Return the data object to send with the request, it can be a FormData
         * object or a plain object.
         *
         * @param  {Object} data
         * @return {FormData|Object}
         */

    }, {
        key: 'formData',
        value: function formData(data) {
            // If this form will not send files, then just return the
            // plain object as data.
            if (!this.hasFiles(data)) {
                return data;
            }

            var formData = new FormData();

            for (var field in data) {
                formData.append(field, this.sanitize(data[field]));
            }

            return formData;
        }
    }, {
        key: 'sanitize',
        value: function sanitize(value) {
            // Avoid to send strings "undefined" or "null" as the field's value.
            if (value === undefined || value === null) {
                return '';
            }

            return value;
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

    return _class;
}();

exports.default = _class;