import GeneratorState from "../Models/GeneratorState";
import Token from '../../LexicalAnalyzer/Models/Token';
import IdentifierMapState from "../Enums/IdentifierMapState";
import Float from "../DataTypes/Float";
import Integer from "../DataTypes/Integer";
import Array from "../DataTypes/Array";
import UnexpectedTokenError from "../Errors/UnexpectedTokenError";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import IdentifierDeclared from "../Errors/IdentifierDeclared";

export default class GeneratorStateManager {
  constructor(private generatorState: GeneratorState) {}
  
  incrementTokenPointer(): number {
    return this.generatorState.tokenPointer++;
  }

  incrementLabelCount(): number {
    return this.generatorState.labelCount++;
  }

  getNewLabel(): string {
    return `label_${this.incrementLabelCount()}`;
  }

  getLabelPointer(label: string): string {
    return `${label}_pointer`;
  }

  setIdentifierMapState(state: IdentifierMapState): void {
    this.generatorState.identifierMapState = state;
  }
  
  setArraySize(arraySizeToken: Token): void {
    if (arraySizeToken.type !== TokenType.number_integer) {
        throw new UnexpectedTokenError(
          arraySizeToken, 
          TokenType.number_integer, 
          TokenType.number_float
        );
    }
    const arrayPassport = this.generatorState.identifierMap[0] as Array; 
    arrayPassport.size = arraySizeToken.tokenPayload as number;
    arrayPassport.initialize();
    this.generatorState.identifierMap[0] = arrayPassport;
  }

  /**
   * Добавление переменных в таблицы переменных.
   * Переменные добавляются в начало массива.
   */
  addToIdentifiersMap(token: Token): void {
    this.validateIdentifier(token);
    switch (this.generatorState.identifierMapState) {
      case IdentifierMapState.write_integer:
        this.generatorState.identifierMap.unshift(
          new Integer(token.tokenPayload as string)
        );
        break;
      case IdentifierMapState.write_float:
        this.generatorState.identifierMap.unshift(
          new Float(token.tokenPayload as string)
        );
        break;
      case IdentifierMapState.write_array:
        this.generatorState.identifierMap.unshift(
          new Array(token.tokenPayload as string)
        );
        break;
      case IdentifierMapState.not_stated:
        throw new Error("identifier map state === not_stated");
    }
  }

  /**
   * Проверка типа текущего токена на соответсвтие ожидаемому типу. 
   * При соответствии перемещает указатель на следующий токен. 
   */
  expectToken(expectedTokenType: TokenType): void {
    const current = this.getCurrentToken().type;
    const expected = expectedTokenType as string;
    if (current !== expected) {
      throw new UnexpectedTokenError(this.getCurrentToken(), expectedTokenType);
    }
    this.incrementTokenPointer();
  }
  
  getCurrentToken(): Token {
    return this.generatorState.tokens[this.generatorState.tokenPointer];
  }

  private validateIdentifier(token: Token): void {
    if (token.type !== TokenType.identifier) {
      throw new UnexpectedTokenError(token, TokenType.identifier);
    }
    if (this.checkIdentifierDeclared(token.tokenPayload as string)) {
      throw new IdentifierDeclared(token.tokenPayload as string);
    }
  }

  private checkIdentifierDeclared(name: string): boolean {
    const result = this.generatorState.identifierMap.find(
      (identifier) => identifier.name === name
    );
    return result !== undefined;
  }
}