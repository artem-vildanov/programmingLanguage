export default class IdentifierNotDeclared implements Error {
    name: string = 'IdentifierNotDeclared';
    message: string;
    constructor(name: string) {
        this.message = `identifier with name [ ${name} ] doesnt exist`; 
    }
}