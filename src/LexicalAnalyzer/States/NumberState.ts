import { SymbolType } from "../Enums/SymbolType";
import State from './State'
import { TransitionRulesTuple } from './State';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import Lexer from '../Lexer';
import FloatNumberState from './FloatNumberState';

export default class NumberState extends State {

    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.errorState(UnexpectedSymbolError)],
        [SymbolType.number, this.setState(NumberState)],
        [SymbolType.dot, this.setState(FloatNumberState)],
        [SymbolType.space, this.endState(this.numberRecognized)],
        [SymbolType.mathOperation, this.endDecrementState(this.numberRecognized)],
        [SymbolType.equalTo, this.endDecrementState(this.numberRecognized)],
        [SymbolType.moreOrLessThan, this.endDecrementState(this.numberRecognized)],
        [SymbolType.notEqualTo, this.errorState(UnexpectedSymbolError)],
        [SymbolType.openRoundBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeRoundBracket, this.endDecrementState(this.numberRecognized)],
        [SymbolType.openSquareBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.closeSquareBracket, this.endDecrementState(this.numberRecognized)],
        [SymbolType.openOrCloseFigureBracket, this.errorState(UnexpectedSymbolError)],
        [SymbolType.comma, this.endDecrementState(this.numberRecognized)],
        [SymbolType.newLine, this.endState(this.skipSymbol)],
        [SymbolType.endOfLine, this.endDecrementState(this.numberRecognized)],
    ];
}
