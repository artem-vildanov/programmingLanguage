export default class UnexpectedSymbolError implements Error {
    name: string = 'UnexpectedSymbolError';
    message: string = 'unexpected symbol';
    constructor() {}
}