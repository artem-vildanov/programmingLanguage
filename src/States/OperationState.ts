import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import WordState from './WordState';
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class OperationState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, this.endDecrementState.bind(this, this.logicOperatorRecognized.bind(this))], 
        [SymbolType.number, this.endDecrementState.bind(this, this.logicOperatorRecognized.bind(this))],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space, this.endState.bind(this, this.logicOperatorRecognized.bind(this))],
        [SymbolType.mathOperation, new UnexpectedSymbolError()],
        [SymbolType.equalTo, this.endState.bind(this, this.doubleOperatorRecognized.bind(this))],    
        [SymbolType.moreOrLessThan, new UnexpectedSymbolError()],
        [SymbolType.notEqualTo, new UnexpectedSymbolError()],
        [SymbolType.openRoundBracket, this.endDecrementState.bind(this, this.logicOperatorRecognized.bind(this))], 
        [SymbolType.closeRoundBracket,  new UnexpectedSymbolError()],
        [SymbolType.openSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.closeSquareBracket, new UnexpectedSymbolError()],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma, new UnexpectedSymbolError()],
        [SymbolType.newLine, new UnexpectedSymbolError()],
        [SymbolType.endOfLine, new UnexpectedSymbolError()],
    ];
}