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

export default class FloatNumberState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, new UnexpectedSymbolError()],
        [SymbolType.number, new FloatNumberState(this.context)], // ЧЕ РЕДАКТОР ВЫЕБЫВАЕТСЯ, МОЖЕТ ЕМУ ПИЗДЫ ДАТЬ?
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space,  () => this.endState(TokenType.space)],
        [SymbolType.mathOperation, () => this.endDecrementState(TokenType.mathOperator)],
        [SymbolType.equalTo, () => this.endDecrementState(TokenType.logicOperator)],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, () => this.endDecrementState(TokenType.logicOperator)], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo, new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket, new UnexpectedSymbolError()],
        [SymbolType.closeRoundBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
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