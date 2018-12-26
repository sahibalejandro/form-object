import axios from 'axios';
import Errors from './errors';
import objectToFormData from 'object-to-formdata';

class Form {
    /**
     * Constructor
     *
     * @return {Form}
     */
    constructor() {
        this.progress = 0;
        this.isPending = false;
        this.errors = new Errors();

        // Create shorcut methods
        ['post', 'patch', 'put', 'delete'].forEach(method => {
            this[method] = (url, data) => {
                return this.submit(method, url, data);
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
    submit(method, url, data = {}) {

        this.progress = 0;
        this.errors.clear();
        this.isPending = true;

        return new Promise((resolve, reject) => {
            Form.defaults.axios[method.toLowerCase()](url, this.formData(data), this.config())
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
     * Get a FormData instance from the given data object, if class FormData is
     * not available the original data object is returned.
     *
     * @param  {Object} data
     * @return {FormData|Object}
     */
    formData(data) {
        if (typeof FormData === 'undefined') {
            return data;
        }

        return objectToFormData(data);
    }

    /**
     * Make a POST or PATCH request depending on whether the resource has an id
     * property.
     *
     * @param  {String} url
     * @param  {Object} resource
     * @return {Promise}
     */
    save(url, resource) {
        let method = 'post';

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
    urlToPatchResource(url, resource) {
        return url.replace(/\/+$/, '') + '/' + resource.id;
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
};

/*
 * Expose default values in order to let users customize behavior.
 */
Form.defaults = {axios};

module.exports = Form;
