import { SymbolType } from "../Symbol";
import Symbol from '../Symbol';
import Lexer from "../Lexer";
import NotLanguageSymbolError from "../Errors/NotLanguageSymbolError";
import { TokenType } from "../Token";
import Token from "../Token";
import InitialState from "./InitialState";
import { keyWords } from "../Keywords";
import StateFactory from "./StateFactory";
// import StateFactory from "./StateFactory";

export type TransitionRulesTuple = [SymbolType, Error|CallableFunction][];

export default abstract class State {

    // массив правил переходов
    protected abstract transitionRules: TransitionRulesTuple;
    symbolTypesList = Object.values(SymbolType);
    protected analyzedSymbol: Symbol|null = null;

    protected constructor(protected context: Lexer) {} // передаем сущность контекста в состояние

    analyze(symbol: string): void {
        this.analyzedSymbol = this.analyzeSymbol(symbol);
        this.changeState();
        this.context.incrementPointer();
    }

    // определяем какой символ считали
    private analyzeSymbol(symbol: string): Symbol {
        for (let i = 0; i < this.symbolTypesList.length; i++) {
            const symbolType: SymbolType = this.symbolTypesList[i];
            const regexExpression = new RegExp(symbolType)
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
        
        const transition = this.findRuleBySymbol();
        
        if (typeof transition === 'object') {
            throw transition;
        }

        if (typeof transition === 'function') {
            transition();
        }
    }

    private findRuleBySymbol(): Error|CallableFunction {
        const analyzedSymbol: string = this.analyzedSymbol?.symbol as string
        let rule: CallableFunction | Error = () => {};

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

    protected endState = function(this: State, semanticProgram: () => void): void { // переход в конечное состояние  
        semanticProgram();
        
        this.context.currentToken = new Token(); // обнуляем токен
        this.context.currentState = new InitialState(this.context);
    }

    protected endDecrementState = function(this: State, semanticProgram: () => void): void { // переход в конечное состояние со смещением указателя назад        
        this.endState.bind(this)(semanticProgram);
        this.context.decrementPointer();
    }

    // STATES SETTERS CALLBACKS

    protected setFloatNumberState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setFloatNumberState();
    }

    protected setNotEqualState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setNotEqualState();
    }

    protected setNumberState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setNumberState();
    }

    protected setOperationState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setOperationState();
    }

    protected setWordState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setWordState();
    }

    // SEMANTIC PROGRAMS

    protected skipSymbol = function(this: State): void {
        // this.context.incrementPointer();
    }

    protected identificatorOrVariableRecognized = function(this: State): void {
        const token = this.context.currentToken;

        const tokenKeyWord = keyWords.find( keyword => token.tokenPayload === keyword);
        if (tokenKeyWord) {
            this.context.currentToken.setType(TokenType.keyword);
        } else {
            this.context.currentToken.setType(TokenType.identifier);
        }

        this.context.tokenList.push(token);
    }.bind(this)

    protected numberRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.number);

        let token = this.context.currentToken;
        token.tokenPayload = this.stringToNumber(token.tokenPayload as string)

        this.context.tokenList.push(token);
    }.bind(this)

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

    protected floatNumberRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.floatNumber);

        const token = this.context.currentToken;
        token.tokenPayload = this.stringToFloat(token.tokenPayload as string);
        this.context.tokenList.push(token);
    }.bind(this)

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

    protected mathOperatorRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.mathOperator);

        const mathOperator: Symbol = this.analyzedSymbol as Symbol;

        this.context.currentToken.addSymbol(mathOperator);
        const token = this.context.currentToken;

        this.context.tokenList.push(token);
    }.bind(this)

    protected logicOperatorRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.logicOperator);

        const logicOperator: Symbol = this.analyzedSymbol as Symbol;

        // this.context.currentToken.addSymbol(logicOperator);
        const token = this.context.currentToken;

        this.context.tokenList.push(token);
    }.bind(this)

    protected doubleOperatorRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.doubleOperator);

        const secondOperator: Symbol = this.analyzedSymbol as Symbol;

        this.context.currentToken.addSymbol(secondOperator);
        const token = this.context.currentToken;

        this.context.tokenList.push(token);
    }.bind(this)

    protected nonLiteralRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.nonLiteral);

        const nonLiteral: Symbol = this.analyzedSymbol as Symbol;

        this.context.currentToken.addSymbol(nonLiteral);
        const token = this.context.currentToken;

        this.context.tokenList.push(token);
    }.bind(this)
}