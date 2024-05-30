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
        [SymbolType.letter, this.setState(WordState)],
        [SymbolType.number, this.errorState(UnexpectedSymbolError)],
        [SymbolType.dot, this.errorState(UnexpectedSymbolError)],
        [SymbolType.space, this.endState(this.identificatorOrVariableRecognized)],
        [SymbolType.mathOperation, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.equalTo, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.moreOrLessThan, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.notEqualTo, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.openRoundBracket, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.closeRoundBracket, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.openSquareBracket, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.closeSquareBracket, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.openOrCloseFigureBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.comma, this.endDecrementState(this.identificatorOrVariableRecognized)],
        [SymbolType.newLine, this.errorState(UnexpectedSymbolError)],
        [SymbolType.endOfLine, this.endDecrementState(this.identificatorOrVariableRecognized)],
    ];
}
