export default class UnexpectedIndexValue implements Error {
    message: string;
    name: string = 'UnexpectedIndexValue';
    constructor(value: number) {
        this.message = `got not integer value [ ${value} ] in array index`;
    }
}