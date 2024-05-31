export default class IdentifierDeclared implements Error {
    name: string = 'IdentifierDeclared';
    message: string;
    constructor(name: string) {
        this.message = `identifier with name [ ${name} ] already exists`; 
    }
}