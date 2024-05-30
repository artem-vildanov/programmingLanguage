import { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';

export default class OperationState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.endDecrementState(this.logicOperatorRecognized)],
        [SymbolType.number, this.endDecrementState(this.logicOperatorRecognized)],
        [SymbolType.dot, this.errorState(UnexpectedSymbolError)],
        [SymbolType.space, this.endState(this.logicOperatorRecognized)],
        [SymbolType.mathOperation, this.errorState(UnexpectedSymbolError)],
        [SymbolType.equalTo, this.endState(this.doubleOperatorRecognized)],
        [SymbolType.moreOrLessThan, this.errorState(UnexpectedSymbolError)],
        [SymbolType.notEqualTo, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openRoundBracket, this.endDecrementState(this.logicOperatorRecognized)],
        [SymbolType.closeRoundBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openOrCloseFigureBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.comma, this.errorState(UnexpectedSymbolError)],
        [SymbolType.newLine, this.errorState(UnexpectedSymbolError)],
        [SymbolType.endOfLine, this.errorState(UnexpectedSymbolError)],
    ];
}
