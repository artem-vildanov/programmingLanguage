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
        [SymbolType.letter,                     new UnexpectedSymbolError()],
        [SymbolType.number,                     this.setNumberState.bind(this)],
        [SymbolType.dot,                        this.setFloatNumberState.bind(this)],
        [SymbolType.space,                      this.endState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.mathOperation,              this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.equalTo,                    this.endDecrementState.bind(this, this.numberRecognized.bind(this))],      
        [SymbolType.moreOrLessThan,             this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.notEqualTo,                 new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket,           new UnexpectedSymbolError()],
        [SymbolType.closeRoundBracket,          this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.openSquareBracket,          new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket,         this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.openOrCloseFigureBracket,   new UnexpectedSymbolError()],
        [SymbolType.comma,                      this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
        [SymbolType.newLine,                    this.endState.bind(this, this.skipSymbol.bind(this))],
        [SymbolType.endOfLine,                  this.endDecrementState.bind(this, this.numberRecognized.bind(this))],
    ];
}