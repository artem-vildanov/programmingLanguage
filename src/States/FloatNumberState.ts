import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';


export default class FloatNumberState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter,                     new UnexpectedSymbolError()],
        [SymbolType.number,                     this.setFloatNumberState.bind(this)], 
        [SymbolType.dot,                        new UnexpectedSymbolError()],
        [SymbolType.space,                      this.endState.bind(this, this.floatNumberRecognized.bind(this))],
        [SymbolType.mathOperation,              this.endDecrementState.bind(this, this.floatNumberRecognized.bind(this))],
        [SymbolType.equalTo,                    this.endDecrementState.bind(this, this.floatNumberRecognized.bind(this))],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan,             this.endDecrementState.bind(this, this.floatNumberRecognized.bind(this))], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo,                 new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket,           new UnexpectedSymbolError()],
        [SymbolType.closeRoundBracket,          this.endDecrementState.bind(this, this.floatNumberRecognized.bind(this))],
        [SymbolType.openSquareBracket,          new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket,         new UnexpectedSymbolError()],
        [SymbolType.openOrCloseFigureBracket,   new UnexpectedSymbolError()],
        [SymbolType.comma,                      new UnexpectedSymbolError()],
        [SymbolType.newLine,                    this.endState.bind(this, this.skipSymbol.bind(this))],
        [SymbolType.endOfLine,                  this.endDecrementState.bind(this, this.floatNumberRecognized.bind(this))],
    ];
}