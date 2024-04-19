import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import OperationState from './OperationState';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class WordState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, () => new WordState(this.context)],
        [SymbolType.number, new UnexpectedSymbolError()],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space,  (analyzedSymbol: Symbol) => this.endState(TokenType.identifier, analyzedSymbol)],
        [SymbolType.mathOperation, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],
        [SymbolType.equalTo, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],     // Какой TpkenType у "!"?
        [SymbolType.openRoundBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.identifier, analyzedSymbol)],
        [SymbolType.closeRoundBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.openSquareBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.closeSquareBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.newLine,  (analyzedSymbol: Symbol) => this.endState(TokenType.newLine, analyzedSymbol)],
        [SymbolType.endOfLine,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.newLine, analyzedSymbol)],
    ];
}