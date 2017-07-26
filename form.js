import axios from 'axios';
import Errors from './errors';

export default class {

    constructor() {
        this.errors = new Errors();
        this.progress = 0;
        this.isPending = false;
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

        this.errors.clear();
        this.isPending = true;
        this.progress = 0;

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
     * Return the data object to send in the request, it can be a FormData
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
            let value = data[field];

            // Avoid to send strings "undefined" or "null" as the field's value.
            if (value === undefined || value === null) {
                value = '';
            }

            formData.append(field, value);
        }

        return formData;
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
     * Handle a request error.
     *
     * @param  {Object} error
     */
    handleError(error) {
        if (error.response && error.response.status === 422) {
            this.errors.set(error.response.data);
        }
    }
}