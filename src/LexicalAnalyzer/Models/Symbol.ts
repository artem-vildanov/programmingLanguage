import { SymbolType } from "../Enums/SymbolType";


export default class Symbol {
    constructor(
        public symbol: string,
        public symbolType: SymbolType
    ) { }
}
