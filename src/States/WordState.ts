import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';
import { SymbolType } from '../Symbol' 

export default class WordState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.setWordState.bind(this)],
        [SymbolType.number, new UnexpectedSymbolError()],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space, this.endState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.mathOperation, this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.equalTo, this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo, this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],     // Какой TpkenType у "!"?
        [SymbolType.openRoundBracket,  this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.closeRoundBracket,  this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.openSquareBracket,  this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.closeSquareBracket,  this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
        [SymbolType.newLine, new UnexpectedSymbolError()],
        [SymbolType.endOfLine, this.endDecrementState.bind(this, this.identificatorOrVariableRecognized.bind(this))],
    ];
}