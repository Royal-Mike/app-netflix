module.exports = class CustomError extends Error {
    constructor(msg, statusCode) {
        super(msg);
        this.statusCode = statusCode;
    }
}