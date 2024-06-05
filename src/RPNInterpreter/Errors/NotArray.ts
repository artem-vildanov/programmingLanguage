export default class NotArray implements Error {
    name: string = 'NotArray';
    message: string;
    constructor(identifierName: string) {
        this.message = `unable to subscript [ ${identifierName} ]: not an array`;
    }
}