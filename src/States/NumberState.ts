import { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';
import FloatNumberState from './FloatNumberState';
import { TokenType } from '../Token';
import Symbol from '../Symbol';

export default class NumberState extends State {

    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, new UnexpectedSymbolError()],
        [SymbolType.number, () => new NumberState(this.context)],
        [SymbolType.dot, () => new FloatNumberState(this.context)],
        [SymbolType.space,  (analyzedSymbol: Symbol) => this.endState(TokenType.space, analyzedSymbol)],
        [SymbolType.mathOperation, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],
        [SymbolType.equalTo, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],      
        [SymbolType.moreOrLessThan, (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.operator, analyzedSymbol)],
        [SymbolType.notEqualTo, () => new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket,  new UnexpectedSymbolError()],
        [SymbolType.closeRoundBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.openSquareBracket,  () => new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.nonLiteral, analyzedSymbol)],
        [SymbolType.newLine,  (analyzedSymbol: Symbol) => this.endState(TokenType.newLine, analyzedSymbol)],
        [SymbolType.endOfLine,  (analyzedSymbol: Symbol) => this.endDecrementState(TokenType.number, analyzedSymbol)],
    ];
}