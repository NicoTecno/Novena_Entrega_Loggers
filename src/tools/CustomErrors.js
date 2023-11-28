/**
 * Class to encapsulate custom error data
 */
export default class CustomErrors extends Error {
    /**
     * Create a custom error.
     * @param {string} [name="Error"] - The name of the error.
     * @param {string} message - The error message.
     * @param {Object} [cause] - The cause of the error.
     * @param {number} [status=1] - The status code of the error.
     */
    static createError(name = "Error", cause, message, status = 1) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = status;
        throw error;
    }
}
