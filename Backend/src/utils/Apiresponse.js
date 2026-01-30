class Apiresponse {
    constructor(statusCode , data , messages = "Success" ){
        this.statusCode = statusCode,
        this.data = data,
        this.messages = messages,
        this.success = statusCode < 400
    }
}

export {Apiresponse}