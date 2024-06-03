import { SymbolType } from "../Symbol";
import Symbol from '../Symbol';
import Lexer from "../Lexer";
import NotLanguageSymbolError from "../Errors/NotLanguageSymbolError";
import { TokenType } from "../Token";
import Token from "../Token";
import InitialState from "./InitialState";
import { keyWords } from "../Keywords";

export type TransitionRulesTuple = [SymbolType, CallableFunction][];

export default abstract class State {

    // массив правил переходов
    protected abstract transitionRules: TransitionRulesTuple;
    symbolTypesList = Object.values(SymbolType);
    protected analyzedSymbol: Symbol | null = null;

    protected constructor(protected context: Lexer) { } // передаем сущность контекста в состояние

    analyze(symbol: string): void {
        this.analyzedSymbol = this.analyzeSymbol(symbol);
        this.changeState();
        this.context.incrementPointer();
    }

    // определяем какой символ считали
    private analyzeSymbol(symbol: string): Symbol {
        for (let i = 0; i < this.symbolTypesList.length; i++) {
            const symbolType: SymbolType = this.symbolTypesList[i];
            const regexExpression = new RegExp(symbolType);
            const result = symbol.match(regexExpression);
            if (result) {
                const analyzedSymbol = new Symbol(result[0], symbolType);
                return analyzedSymbol;
            }
        }

        // введенный символ не подходит нашей грамматике
        throw new NotLanguageSymbolError(symbol);
    }

    // смена состояния контекста
    private changeState(): void {
        this.findRuleBySymbol()();
    }

    private findRuleBySymbol(): CallableFunction {
        const analyzedSymbol: string = this.analyzedSymbol?.symbol as string;
        let rule: CallableFunction = () => { };
        for (let i = 0; i < this.transitionRules.length; i++) {
            const transitionRule = this.transitionRules[i];
            const regex = transitionRule[0];
            const value = transitionRule[1];
            const regexExpression = new RegExp(regex);
            const result = analyzedSymbol.match(regexExpression);
            if (result) {
                rule = value;
                break;
            }
        }
        if (!rule) {
            throw Error('rule not found');
        }
        return rule;
    }

    // END STATES CALLBACKS
    protected endState = (semanticProgram: () => void): CallableFunction => { // переход в конечное состояние  
        return () => {
            semanticProgram();
            this.context.currentToken = new Token(); // обнуляем токен
            this.context.currentState = new InitialState(this.context);
        }
    }

    protected endDecrementState = (semanticProgram: () => void): CallableFunction => { // переход в конечное состояние со смещением указателя назад        
        return () => {
            this.endState(semanticProgram)();
            this.context.decrementPointer();
        }
    }

    protected setState<T extends State>(stateClass: new (context: Lexer) => T): CallableFunction {
        return () => {
            this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
            this.context.setState(stateClass);
        }
    }

    protected errorState<T extends Error>(errorState: new () => T): CallableFunction {
        return () => {
            throw new errorState();
        }
    }

    // SEMANTIC PROGRAMS

    protected skipSymbol = (): void => { }

    protected identificatorOrVariableRecognized = (): void => {
        const tokenKeyWord = keyWords.find(keyword => this.context.currentToken.tokenPayload === keyword);
        if (tokenKeyWord) {
            this.setTokenTypeAndAddToTokenList();
        } else {
            this.context.currentToken.setType(TokenType.identifier);
            this.context.tokenList.push(this.context.currentToken);
        }
    }

    protected numberRecognized = (): void => {
        this.context.currentToken.setType(TokenType.number_integer);
        let token = this.context.currentToken;
        token.tokenPayload = this.stringToNumber(token.tokenPayload as string)
        this.context.tokenList.push(token);
    }

    protected floatNumberRecognized = (): void => {
        this.context.currentToken.setType(TokenType.number_float);
        const token = this.context.currentToken;
        token.tokenPayload = this.stringToFloat(token.tokenPayload as string);
        this.context.tokenList.push(token);
    }

    protected mathOperatorRecognized = (): void => {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.setTokenTypeAndAddToTokenList();
    }

    protected logicOperatorRecognized = (): void => {
        this.setTokenTypeAndAddToTokenList();
    }

    protected doubleOperatorRecognized = (): void => {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.setTokenTypeAndAddToTokenList();
    }

    protected nonLiteralRecognized = (): void => {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.setTokenTypeAndAddToTokenList();
    }

    protected setTokenTypeAndAddToTokenList() {
        const tokenPayload = this.context.currentToken.tokenPayload as string;
        const tokenType = this.findTokenType(tokenPayload);
        this.context.currentToken.setType(tokenType);
        this.context.tokenList.push(this.context.currentToken);
    }

    protected stringToNumber(str: string): number {
        let num = 0;
        const zeroCharCode = '0'.charCodeAt(0);
        for (let i = 0; i < str.length; i++) {
            const digit = str.charCodeAt(i) - zeroCharCode;
            if (digit < 0 || digit > 9) {
                throw new Error('Invalid input');
            }
            num = num * 10 + digit;
        }
        return num;
    }

    protected stringToFloat(str: string): number {
        let num = 0;
        let decimalPart = 0;
        let decimalPosition = 1;
        let isDecimal = false;
        const zeroCharCode = '0'.charCodeAt(0);
        const dotCharCode = '.'.charCodeAt(0);
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode === dotCharCode) {
                if (isDecimal) {
                    throw new Error('Invalid input');
                }
                isDecimal = true;
            } else {
                const digit = charCode - zeroCharCode;
                if (digit < 0 || digit > 9) {
                    throw new Error('Invalid input');
                }
                if (isDecimal) {
                    decimalPart = decimalPart * 10 + digit;
                    decimalPosition *= 10;
                } else {
                    num = num * 10 + digit;
                }
            }
        }
        if (isDecimal) {
            num += decimalPart / decimalPosition;
        }
        return num;
    }

    protected findTokenType(value: string): keyof typeof TokenType {
        const tokenTypeKeys = Object.keys(TokenType) as Array<keyof typeof TokenType>;
        const tokenType = tokenTypeKeys.find(key => TokenType[key] === value);
        if (tokenType === undefined) {
            throw new Error(`token type [${value}] not found`);
        }
        return tokenType;
    }
}
