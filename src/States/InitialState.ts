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

export default class InitialState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, new WordState(this.context)],
        [SymbolType.number, new NumberState(this.context)],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space, new InitialState(this.context)],
        [SymbolType.mathOperation, () => this.endState(TokenType.mathOperator)],
        [SymbolType.equalTo, new OperationState(this.context)],
        [SymbolType.moreOrLessThan, new OperationState(this.context)],
        [SymbolType.notEqualTo, new NotEqualState(this.context)],
        [SymbolType.openRoundBracket,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.closeRoundBracket,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.openSquareBracket,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.closeRoundBracket,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.openOrCloseFigureBracket,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.comma,  () => this.endState(TokenType.nonLiteral)],
        [SymbolType.newLine,  () => this.endState(TokenType.newLine)],
        [SymbolType.endOfLine,  () => this.endState(TokenType.newLine)],
    ];
}