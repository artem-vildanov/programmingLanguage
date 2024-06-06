export default class DivideByZero implements Error {
    message: string;
    name = 'DivideByZero';
    constructor() {
        this.message = `divide by zero`;
    }
}