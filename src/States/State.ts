import { SymbolType } from "../Symbol";
import Symbol from '../Symbol';
import Lexer from "../Lexer";
import NotLanguageSymbolError from "../Errors/NotLanguageSymbolError";
import { TokenType } from "../Token";
import Token from "../Token";

export type TransitionRulesTuple = [SymbolType, State|Error|CallableFunction][];

export default abstract class State {

    // массив правил переходов
    protected abstract transitionRules: TransitionRulesTuple;
    symbolTypesList = Object.values(SymbolType);

    protected constructor(protected context: Lexer) {} // передаем сущность контекста в состояние

    protected endState(tokenType: TokenType): void { // переход в конечное состояние
        this.context.currentToken.setType(tokenType);
        const lexeme = this.context.currentToken;
        this.context.tokenList.push(lexeme); // добавляем готовую лексему в список лексем

        this.context.currentToken = new Token(); // обнуляем токен
        this.context.incrementPointer(); 
    }

    protected endDecrementState(tokenType: TokenType): void { // переход в конечное состояние со смещением указателя назад
        this.context.currentToken.setType(tokenType);
        const lexeme = this.context.currentToken;
        this.context.tokenList.push(lexeme); // добавляем готовую лексему в список лексем

        this.context.currentToken = new Token(); // обнуляем токен
        
        // не инкрементируем указатель!
    }

    analyze(symbol: string): void {
        const analyzedSymbol = this.analyzeSymbol(symbol);
        this.changeState(analyzedSymbol);
        this.context.incrementPointer();
    }

    // определяем какой символ считали
    private analyzeSymbol(symbol: string): Symbol {
        this.symbolTypesList.forEach( symbolType => {    
            const regexExpression = new RegExp(symbolType)
            const result = symbol.match(regexExpression);
            if (result) {
                const analyzedSymbol = new Symbol(result[0], symbolType);
                this.context.currentToken.addSymbol(analyzedSymbol);
                return analyzedSymbol;
            }
        })

        // введенный символ не подходит нашей грамматике
        throw new NotLanguageSymbolError(symbol);
    }

    // смена состояния контекста
    private changeState(analyzedSymbol: Symbol): void {
        const transition = this.findRuleBySymbol(analyzedSymbol.symbolType);
        if (typeof transition === 'function') { // функция это если состояние Z или Z*
            transition();
        }

        if (transition instanceof State) { // если это любое не конечное состояние
            this.context.currentState = transition;
        }

        if (transition instanceof Error) {
            throw transition;
        }
    }

    private findRuleBySymbol(symbol: SymbolType): State|CallableFunction|Error {
        const rule = this.transitionRules.find(([key, value]) => symbol === key);
        
        if (!rule) {
            throw Error('rule not found');
        }

        const transition = rule[1];
        return transition;
    }
}