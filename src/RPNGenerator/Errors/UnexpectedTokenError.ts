import Token, { TokenType } from "../../LexicalAnalyzer/Token";

export default class UnexpectedTokenError implements Error {
    name: string = 'UnexpectedTokenError';
    message: string;
    constructor(gotToken: Token, expectedTokenType: TokenType) {
        this.message = `got token [ ${gotToken} ], expected token type [ ${expectedTokenType} ]`; 
    }
}