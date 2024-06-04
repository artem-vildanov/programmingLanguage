import { SymbolType } from "../Enums/SymbolType";
import State from './State'
import WordState from './WordState';
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import OperationState from './OperationState';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';

export default class InitialState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.setState(WordState)],
        [SymbolType.number, this.setState(NumberState)],
        [SymbolType.dot, this.errorState(UnexpectedSymbolError)],
        [SymbolType.space, this.endState(this.skipSymbol)],
        [SymbolType.mathOperation, this.endState(this.mathOperatorRecognized)],
        [SymbolType.equalTo, this.setState(OperationState)],
        [SymbolType.moreOrLessThan, this.setState(OperationState)],
        [SymbolType.notEqualTo, this.setState(NotEqualState)],
        [SymbolType.openRoundBracket, this.endState(this.nonLiteralRecognized)],
        [SymbolType.closeRoundBracket, this.endState(this.nonLiteralRecognized)],
        [SymbolType.openSquareBracket, this.endState(this.nonLiteralRecognized)],
        [SymbolType.closeSquareBracket, this.endState(this.nonLiteralRecognized)],
        [SymbolType.openOrCloseFigureBracket, this.endState(this.nonLiteralRecognized)],
        [SymbolType.comma, this.endState(this.nonLiteralRecognized)],
        [SymbolType.newLine, this.endState(this.skipSymbol)],
        [SymbolType.endOfLine, this.endState(this.nonLiteralRecognized)],
    ];
}
