class ApiResponse{
    /**
     * 
     * @param {Number} statusCode 
     * @param {string} message 
     * @param {any[]} data 
     */
    constructor (statusCode=200,message="ok",data) {
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success=statusCode<400;
    }
}
module.exports={ApiResponse}