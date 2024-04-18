import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import WordState from './WordState';
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import OperationState from './OperationState';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class OperationState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, () => this.endDecrementState(TokenType.default)], // ТОКЕН ТАЙП ЧЕТО ХУЙ ЕГО ЗНАЕТ
        [SymbolType.number, () => this.endDecrementState(TokenType.number)],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space,  () => this.endState(TokenType.space)],
        [SymbolType.mathOperation, new UnexpectedSymbolError()],
        [SymbolType.equalTo, () => this.endState(TokenType.logicOperator)],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, new UnexpectedSymbolError()],
        [SymbolType.notEqualTo, new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket, () => this.endState(TokenType.nonLiteral)], // Какой токен тайп?
        [SymbolType.closeRoundBracket,  new UnexpectedSymbolError()],
        [SymbolType.openSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  new UnexpectedSymbolError()],
        [SymbolType.newLine,  () => this.endState(TokenType.newLine)],
        [SymbolType.endOfLine,  () => this.endDecrementState(TokenType.newLine)],
    ];

    protected changeState(analyzedSymbol: Symbol): State {
        
    }
}