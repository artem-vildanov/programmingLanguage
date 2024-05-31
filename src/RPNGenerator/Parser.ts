import { IdentifierMapState } from "./Generator";
import Array from "./DataTypes/Array";
import Float from "./DataTypes/Float";
import Integer from "./DataTypes/Integer";
import Token, { TokenType } from "../LexicalAnalyzer/Token";
import UnexpectedTokenError from "./Errors/UnexpectedTokenError";
import { GeneratorState } from "./Generator";

export type GenerationRulesTuple = [TokenType, CallableFunction][];

export default abstract class Parser {

  constructor(protected generatorState: GeneratorState) { }
  protected abstract generationRules: GenerationRulesTuple;

  /**
   * Получаем текущий анализируемый токен(терминальный символ). 
   * Ищем порождающее правило, которое начинается с этого терминального символа.
   * Вызываем соответствующее правило. 
   */
  public parse(): GeneratorState {
    const token = this.getCurrentToken();
    const callable = this.findRuleByToken(token);
    return callable(); 
  }

  private findRuleByToken(inputToken: Token): CallableFunction {
    let rule = this.generationRules.find(([type, handler]) => type === inputToken.type);
    if (rule === undefined) {
      /**
       * Ищем lambda rule
       */
      rule = this.generationRules.find(([type, handler]) => type === TokenType.default);
      if (rule === undefined) {
        throw new Error(`unexpected token ${inputToken}, expected: ${this.generationRules}`);
      }

      return rule[1]; 
    }

    return rule[1];
  }


  protected incrementTokenPointer(): number {
    return this.generatorState.tokenPointer++;
  }

  protected incrementLabelCount(): number {
    return this.generatorState.labelCount++;
  }

  protected getNewLabel(): string {
    return `L${this.incrementLabelCount()}`;
  }

  protected expectToken(expectedTokenType: TokenType): void {
    const current = this.getCurrentToken().type;
    const expected = expectedTokenType as string;
    if (current !== expected) {
      throw new UnexpectedTokenError(this.getCurrentToken(), expectedTokenType);
    }

    this.incrementTokenPointer();
  }

  protected pushCurrentTokenToRpn(): void {
    const token = this.getCurrentToken();
    this.generatorState.generatedRPN.push(token.tokenPayload as string);
    this.incrementTokenPointer();
  }

  protected getCurrentToken(): Token {
    return this.generatorState.tokens[this.generatorState.tokenPointer];
  }

  /**
   * Добавление переменных в таблицы переменных.
   * Переменные добавляются в начало массива.
   */
  protected addCurrentTokenToIdentifiersMap(): void {
    const token = this.getCurrentToken();
    if (token.type !== TokenType.identifier) {
        throw new UnexpectedTokenError(token, TokenType.identifier);
    }

    switch (this.generatorState.identifierMapState) {
      case IdentifierMapState.write_integer:
        this.generatorState.identifierMap.unshift(new Integer(token.tokenPayload as string));           
        break;
  
      case IdentifierMapState.write_float:
        this.generatorState.identifierMap.unshift(new Float(token.tokenPayload as string)); 
        break;
  
      case IdentifierMapState.write_array:
        this.generatorState.identifierMap.unshift(new Array(token.tokenPayload as string));            
        break;

      case IdentifierMapState.not_stated:
        throw new Error('identifier map state === not_stated');
    }

    this.generatorState.identifierMapState = IdentifierMapState.not_stated;
  }

  protected getParser<T extends Parser>(stateClass: new (generatorState: GeneratorState) => T): Parser {
    return new stateClass(this.generatorState);
  }
}