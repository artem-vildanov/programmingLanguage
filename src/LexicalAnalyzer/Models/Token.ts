import { TokenType } from '../Enums/TokenType';
import Symbol from "./Symbol";


// токен - это терминальный символ

export default class Token {
    public tokenPayload: string | number = '';
    public tokenPayloadInSymbols: Symbol[] = [];
    public type: TokenType = TokenType.default;
    public typeKey: keyof typeof TokenType = "default";

    addSymbol(inputSymbol: Symbol) {
        this.tokenPayloadInSymbols.push(inputSymbol);
        this.tokenPayload += inputSymbol.symbol;
    }

    setType(type: keyof typeof TokenType) {
        this.typeKey = type;
        this.type = TokenType[type];
    }
}
