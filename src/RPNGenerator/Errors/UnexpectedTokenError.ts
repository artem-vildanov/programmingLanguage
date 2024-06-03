import Token, { TokenType } from "../../LexicalAnalyzer/Token";

export default class UnexpectedTokenError implements Error {
    name: string = 'UnexpectedTokenError';
    message: string;
    constructor(gotToken: Token, expectedTokenType: TokenType) {
        this.message = `got token [ payload: ${gotToken.tokenPayload} | type: ${gotToken.typeKey} ], expected token type [ ${expectedTokenType as string} ]`; 
    }
}