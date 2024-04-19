import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import WordState from './WordState';
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class OperationState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)], 
        [SymbolType.number, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space,  (analyzedSymbol: Symbol) => this.endState(TokenType.operator, analyzedSymbol)],
        [SymbolType.mathOperation, new UnexpectedSymbolError()],
        [SymbolType.equalTo, (analyzedSymbol: Symbol) => this.endState(TokenType.doubleOperator, analyzedSymbol)],    
        [SymbolType.moreOrLessThan, new UnexpectedSymbolError()],
        [SymbolType.notEqualTo, new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket, (analyzedSymbol: Symbol) => this.endState(TokenType.nonLiteral, analyzedSymbol)], 
        [SymbolType.closeRoundBracket,  new UnexpectedSymbolError()],
        [SymbolType.openSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  new UnexpectedSymbolError()],
        [SymbolType.newLine,  (analyzedSymbol: Symbol) => this.endState(TokenType.newLine, analyzedSymbol)],
        [SymbolType.endOfLine,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.newLine, analyzedSymbol)],
    ];
}