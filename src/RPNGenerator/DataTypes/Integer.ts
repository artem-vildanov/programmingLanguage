import { TokenType } from "../../LexicalAnalyzer/Token";
import DataType from "./DataType";

export default class Integer extends DataType {
    value: number = 0;
    type: string = 'integer';
    constructor(name: string) {
       super(name);
    }
}

