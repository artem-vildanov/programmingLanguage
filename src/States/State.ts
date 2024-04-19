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
    // stateFactory: StateFactory = new StateFactory();
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

        if (transition instanceof Error) {
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
        //this.context.currentState = StateFactory.getFloatNumberState(this.context);
    }

    protected setNotEqualState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setNotEqualState();
        // this.context.currentState = StateFactory.getNotEqualState(this.context);
    }

    protected setNumberState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setNumberState();
        // this.context.currentState = StateFactory.getNumberState(this.context);
    }

    protected setOperationState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setOperationState();
        // this.context.currentState = StateFactory.getOperationState(this.context);
    }

    protected setWordState = function(this: State): void {
        this.context.currentToken.addSymbol(this.analyzedSymbol as Symbol);
        this.context.setWordState();
        // this.context.currentState = StateFactory.getWordState(this.context);
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

        const token = this.context.currentToken;
        this.context.tokenList.push(token);
    }.bind(this)

    protected floatNumberRecognized = function(this: State): void {
        this.context.currentToken.setType(TokenType.floatNumber);

        const token = this.context.currentToken;
        this.context.tokenList.push(token);
    }.bind(this)

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