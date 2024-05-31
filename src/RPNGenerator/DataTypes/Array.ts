import DataType from "./DataType";

export default class Array extends DataType {
    value = [] as DataType[];
    type: string = 'array';
    size: number = 0;
    constructor(name: string) {
        super(name);
    }
}