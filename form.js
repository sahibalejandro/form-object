import axios from 'axios';
import Errors from './errors';

export default class {

    constructor(data = {}) {
        this.data = {};
        this.originalData = data;
        this.errors = new Errors();
        this.progress = 0;

        this.isPending = false;
        this.isEditing = data.hasOwnProperty('id');

        this.reset();
    }

    /**
     * Reset the form data.
     */
    reset() {
        // If you concern about performance then you should use
        // lodash.cloneDeep() instead.
        this.data = JSON.parse(JSON.stringify(this.originalData));
    }

    /**
     * Sends the data to the given url using POST method.
     *
     * @param  {String} url
     * @return {Promise}
     */
    post(url) {
        return this.submit('post', url);
    }

    /**
     * Sends the data to the given url using POST method if the form is in
     * creation mode or using PATCH method if it is in edit mode.
     *
     * @param  {String} url
     * @return {Promise}
     */
    save(url) {
        let method = this.isEditing ? 'patch' : 'post';
        url += this.isEditing ? `/${this.data.id}` : '';

        return this.submit(method, url);
    }

    /**
     * Submit the form to the given URL using the method specified.
     *
     * @param  {String} method
     * @param  {String} url
     * @return {Promise}
     */
    submit(method, url) {

        this.errors.clear();
        this.isPending = true;
        this.progress = 0;

        return new Promise((resolve, reject) => {
            axios[method.toLowerCase()](url, this.formData(), this.config())
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
     * Return true if some field is a File object.
     *
     * @return {Boolean}
     */
    hasFiles() {
        for (let prop in this.data) {
            if (this.data[prop] instanceof File) {
                return true;
            }
        }

        return false;
    }

    /**
     * Return the data object to send in the request, it can be a FormData
     * object or a plain object.
     *
     * @return {FormData|Object}
     */
    formData() {
        // If this form will not send files, then just return the
        // plain object as data.
        if ( ! this.hasFiles()) {
            return this.data;
        }

        let formData = new FormData();

        for (let field in this.data) {
            let value = this.data[field];

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
