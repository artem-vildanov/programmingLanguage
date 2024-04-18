import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import OperationState from './OperationState';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class NumberState extends State {

    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, new UnexpectedSymbolError()],
        [SymbolType.number, new NumberState(this.context)],
        [SymbolType.dot, new FloatNumberState(this.context)],
        [SymbolType.space,  () => this.endState(TokenType.space)],
        [SymbolType.mathOperation, () => this.endDecrementState(TokenType.mathOperator)],
        [SymbolType.equalTo, () => this.endDecrementState(TokenType.logicOperator)],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, () => this.endDecrementState(TokenType.logicOperator)], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo, () => new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket,  new UnexpectedSymbolError()],
        [SymbolType.closeRoundBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.openSquareBracket,  () => new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.newLine,  () => this.endState(TokenType.newLine)],
        [SymbolType.endOfLine,  () => this.endDecrementState(TokenType.newLine)],
    ];

    protected changeState(analyzedSymbol: Symbol): State {
        
    }
}