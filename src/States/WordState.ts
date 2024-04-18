import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import { TransitionRulesTuple } from './State';
import NumberState from './NumberState';
import UnexpectedSymbolError from '../Errors/UnexpectedSymbolError';
import OperationState from './OperationState';
import NotEqualState from './NotEqualState';
import Lexer from '../Lexer';
import Token, { TokenType } from '../Token';

export default class WordState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected changeState(analyzedSymbol: Symbol): State {
        // switch (analyzedSymbol.symbolType) {
        //     case SymbolType.letter:
        //         return new WordState();
        //         break;
        
        //     default:
        //         throw Error('unexpected symbol'); // TODO переделать
        //         break;
        // }
            
    }

    protected transitionRules: TransitionRulesTuple = [
        [SymbolType.letter, new WordState(this.context)],
        [SymbolType.number, new UnexpectedSymbolError()],
        [SymbolType.dot, new UnexpectedSymbolError()],
        [SymbolType.space,  () => this.endState(TokenType.space)],
        [SymbolType.mathOperation, () => this.endDecrementState(TokenType.mathOperator)],
        [SymbolType.equalTo, () => this.endDecrementState(TokenType.logicOperator)],        // Какой TokenType у "="?
        [SymbolType.moreOrLessThan, () => this.endDecrementState(TokenType.logicOperator)], // Какой TokenType у ">", "<"?
        [SymbolType.notEqualTo, () => this.endDecrementState(TokenType.logicOperator)],     // Какой TpkenType у "!"?
        [SymbolType.openRoundBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.closeRoundBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.openSquareBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.closeSquareBracket,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.openOrCloseFigureBracket,  new UnexpectedSymbolError()],
        [SymbolType.comma,  () => this.endDecrementState(TokenType.nonLiteral)],
        [SymbolType.newLine,  () => this.endState(TokenType.newLine)],
        [SymbolType.endOfLine,  () => this.endDecrementState(TokenType.newLine)],
    ];
}