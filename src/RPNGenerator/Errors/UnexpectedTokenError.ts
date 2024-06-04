import Token from '../../LexicalAnalyzer/Models/Token';
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';

export default class UnexpectedTokenError implements Error {
    name: string = 'UnexpectedTokenError';
    message: string;
    constructor(gotToken: Token, ...expectedTokenTypes: TokenType[]) {
        const expectedTokenTypesString = expectedTokenTypes.join(', ');
        this.message = `got token [ payload: ${gotToken.tokenPayload} , type: ${gotToken.typeKey} ], expected token type [ ${expectedTokenTypesString} ]`; 
    }
}