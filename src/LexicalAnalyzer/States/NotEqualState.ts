import { SymbolType } from "../Enums/SymbolType";
import State from './State';
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';

export default class NotEqualState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.errorState(UnexpectedSymbolError)],
        [SymbolType.number, this.errorState(UnexpectedSymbolError)],
        [SymbolType.dot, this.errorState(UnexpectedSymbolError)],
        [SymbolType.space, this.errorState(UnexpectedSymbolError)],
        [SymbolType.mathOperation, this.errorState(UnexpectedSymbolError)],
        [SymbolType.equalTo, this.endState(this.doubleOperatorRecognized)],
        [SymbolType.moreOrLessThan, this.errorState(UnexpectedSymbolError)],
        [SymbolType.notEqualTo, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openRoundBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeRoundBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openOrCloseFigureBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.comma, this.errorState(UnexpectedSymbolError)],
        [SymbolType.newLine, this.errorState(UnexpectedSymbolError)],
        [SymbolType.endOfLine, this.errorState(UnexpectedSymbolError)],
    ];
}
