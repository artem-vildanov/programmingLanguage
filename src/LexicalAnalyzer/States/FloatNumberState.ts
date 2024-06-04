import { SymbolType } from "../Enums/SymbolType";
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';


export default class FloatNumberState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.errorState(UnexpectedSymbolError)],
        [SymbolType.number, this.setState(FloatNumberState)],
        [SymbolType.dot, this.errorState(UnexpectedSymbolError)],
        [SymbolType.space, this.endState(this.floatNumberRecognized)],
        [SymbolType.mathOperation, this.endDecrementState(this.floatNumberRecognized)],
        [SymbolType.equalTo, this.endDecrementState(this.floatNumberRecognized)],
        [SymbolType.moreOrLessThan, this.endDecrementState(this.floatNumberRecognized)],
        [SymbolType.notEqualTo, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openRoundBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeRoundBracket, this.endDecrementState(this.floatNumberRecognized)],
        [SymbolType.openSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openOrCloseFigureBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.comma, this.errorState(UnexpectedSymbolError)],
        [SymbolType.newLine, this.endState(this.skipSymbol)],
        [SymbolType.endOfLine, this.endDecrementState(this.floatNumberRecognized)],
    ];
}
