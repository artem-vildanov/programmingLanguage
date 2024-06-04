import Token from './Models/Token';
import InitialState from './States/InitialState';
import State from './States/State'

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

    setState(stateClass: new (context: Lexer) => State): void {
        this.currentState = new stateClass(this);
    }
}
