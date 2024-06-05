export default abstract class DataType {
    name: string;
    abstract type: string;
    abstract value: number | DataType[] | boolean;
    constructor(name: string) {
        this.name = name;
    }
}