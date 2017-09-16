module.exports = class {

    /**
     * Constructor
     *
     * @return {Errors}
     */
    constructor() {
        this.errors = {};
    }

    /**
     * Set the errors from a JSON encoded Laravel errors bag object.
     *
     * @param {Object} errors
     */
    set(errors) {
        this.errors = errors;
    }

    /**
     * Check if the given field has an error.
     *
     * @param  {String} field
     * @return {Boolean}
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    /**
     * Get the error message for the given field.
     *
     * @param  {String} field
     * @return {String}
     */
    get(field) {
        if (this.has(field)) {
            return this.errors[field][0];
        }
    }

    /**
     * Get all error messages for the given field.
     *
     * @param  {String} field
     * @return {Array}
     */
    getAll(field) {
        if (this.has(field)) {
            return this.errors[field];
        }
    }

    /**
     * Clear the error message for the given field or all errors if no field is
     * specified.
     *
     * @param  {String} field
     */
    clear(field) {
        if (field) {
            delete this.errors[field];
        } else {
            this.errors = {};
        }
    }
};
