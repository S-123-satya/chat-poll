class ApiError extends Error{
    /**
     * 
     * @param {number} statusCode 
     * @param {any[]} errors 
     * @param {string} message 
     * @param {string} stack 
     */
    constructor(statusCode=404,message="Something went wrong",errors=[],stack=""){
        super(message);
        this.statusCode=statusCode;
        this.errors=errors;
        this.message=message;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
        }
}
module.exports= {ApiError}