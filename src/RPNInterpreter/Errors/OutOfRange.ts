export default class OutOfRange implements Error {
    message: string;
    name: string = 'OutOfRange';
    constructor(arrayName: string, index: number) {
        this.message = `out of range of array [ ${arrayName} ] when tried to address index [ ${index} ]`;
    }
}