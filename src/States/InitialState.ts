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
        [SymbolType.letter,                     this.setWordState.bind(this)],
        [SymbolType.number,                     this.setNumberState.bind(this)],
        [SymbolType.dot,                        () => new UnexpectedSymbolError()],
        [SymbolType.space,                      this.endState.bind(this, this.skipSymbol.bind(this))],
        [SymbolType.mathOperation,              this.endState.bind(this, this.mathOperatorRecognized.bind(this))],
        [SymbolType.equalTo,                    this.setOperationState.bind(this)],
        [SymbolType.moreOrLessThan,             this.setOperationState.bind(this)],
        [SymbolType.notEqualTo,                 this.setNotEqualState.bind(this)],
        [SymbolType.openRoundBracket,           this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.closeRoundBracket,          this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.openSquareBracket,          this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.closeRoundBracket,          this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.openOrCloseFigureBracket,   this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.comma,                      this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
        [SymbolType.newLine,                    this.endState.bind(this, this.skipSymbol.bind(this))],
        [SymbolType.endOfLine,                  this.endState.bind(this, this.nonLiteralRecognized.bind(this))],
    ];
}