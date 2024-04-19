import Token from './Token'
import { TokenType } from './Token';
import InitialState from './States/InitialState';
import State from './States/State'
import StateFactory from './States/StateFactory';

export default class Lexer {
    private code: string;
    private pointer: number = 0;    

    currentState: State = new InitialState(this);
    currentToken: Token = new Token();
    tokenList: Token[] = [];

    constructor(code: string) {
        this.code = code;
    }

    lexicalAnalysis(): Token[] {
        while (this.nextSymbol());
        return this.tokenList;
    }

    private nextSymbol(): boolean {
        if (this.pointer >= this.code.length) {
            return false;
        }

        const currentSymbol = this.code[this.pointer];
        this.currentState.analyze(currentSymbol);

        return true;
    }

    incrementPointer(): void {
        this.pointer++
    }

    decrementPointer(): void {
        this.pointer--
    }

    setFloatNumberState(): void {
        this.currentState = StateFactory.getFloatNumberState(this);
    }

    setInitialState(): void {
        this.currentState = StateFactory.getInitialState(this);
    }

    setNotEqualState(): void {
        this.currentState = StateFactory.getNotEqualState(this);
    }

    setNumberState(): void {
        this.currentState = StateFactory.getNumberState(this);
    }

    setOperationState(): void {
        this.currentState = StateFactory.getOperationState(this);
    }

    setWordState(): void {
        this.currentState = StateFactory.getWordState(this);
    }
}