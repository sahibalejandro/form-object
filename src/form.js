import axios from 'axios';
import Errors from './errors';

export default class {

    /**
     * Constructor
     *
     * @return {Form}
     */
    constructor() {
        this.progress = 0;
        this.isPending = false;
        this.errors = new Errors();
    }

    /**
     * Submit the form to the given URL using the method specified.
     *
     * @param  {String} method
     * @param  {String} url
     * @param  {Object} data
     * @return {Promise}
     */
    submit(method, url, data) {

        this.progress = 0;
        this.errors.clear();
        this.isPending = true;

        return new Promise((resolve, reject) => {
            axios[method.toLowerCase()](url, this.formData(data), this.config())
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    this.handleError(error);
                    reject(error);
                })
                .then(() => this.isPending = false);
        });
    }

    /**
     * Return true if some field in data object is a File object.
     *
     * @param  {Object} data
     * @return {Boolean}
     */
    hasFiles(data) {
        for (let prop in data) {
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
    formData(data) {
        // If this form will not send files, then just return the
        // plain object as data.
        if (! this.hasFiles(data)) {
            return data;
        }

        let formData = new FormData();

        for (let field in data) {
            formData.append(field, this.sanitize(data[field]));
        }

        return formData;
    }

    sanitize(value) {
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
    config() {
        return {
            onUploadProgress: progressEvent => {
                this.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
        }
    }

    /**
     * Handle a error response.
     *
     * @param  {Object} response
     * @return {Boolean}
     */
    handleError(response) {
        if (response.response && response.response.status === 422) {

            // Laravel >= 5.5 wraps the errors inside an "errors" object.
            let errors = response.response.data.hasOwnProperty('errors')
                ? response.response.data.errors
                : response.response.data;

            this.errors.set(errors);
        }
    }
}