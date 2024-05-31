import DataType from "./DataType";

export default class Float extends DataType{
    value: number = 0.0;
    type: string = 'float';
    constructor(name: string) {
        super(name);
    }
}