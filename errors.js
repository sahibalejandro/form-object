export default class {

    constructor() {
        this.errors = {};
    }

    /**
     * Set the errors using an Laravel's error bag object.
     *
     * @param {Object} errors
     */
    set(errors) {
        this.errors = errors;
    }

    /**
     * Set the errors for the given field.
     *
     * @param  {String} name
     * @param  {Array} errors
     */
    setFor(name, errors) {
        this.errors[name] = errors;
    }

    /**
     * Checks if a field has error.
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
     * Clear the error on a field or all errors if no field is specified.
     *
     * @param  {String} field
     */
    clear(field) {
        if (field) {
            delete this.errors[field];
            return;
        }

        this.errors = {};
    }
}
