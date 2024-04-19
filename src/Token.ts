import Symbol from './Symbol';

export enum TokenType {
    default = 'DEFAULT',
    identifier = 'IDENTIFIER',
    keyword = 'KEYWORD',    
    number = 'NUMBER',
    floatNumber = 'FLOAT',
    mathOperator = 'MATH_OPER',
    logicOperator = 'LOGIC_OPER',
    doubleOperator = 'DOUBLE_OPER',
    nonLiteral = 'NON_LITERAL',
    space = 'SPACE',
    newLine = 'NEW_LINE'
}

// токен - это терминальный символ
export default class Token {
    public tokenPayload: string = '';
    public tokenPayloadInSymbols: Symbol[] = [];
    public type: TokenType = TokenType.default;   

    addSymbol(inputSymbol: Symbol) {
        this.tokenPayloadInSymbols.push(inputSymbol);
        this.tokenPayload += inputSymbol.symbol;
    }

    setType(type: TokenType) {
        this.type = type;
    }
}