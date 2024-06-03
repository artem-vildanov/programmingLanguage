import MoreArraysParser from "./MoreArraysParser";
import UnexpectedTokenError from "../Errors/UnexpectedTokenError";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import Array from "../DataTypes/Array";

export default class ArrayDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleArrayDefinition = () => {
    this.addCurrentTokenToIdentifiersMap();
    this.incrementTokenPointer();

    /** 
     * Ожидаем отрывающей квадратной скобки для объявления размера массива 
     */
    this.expectToken(TokenType.non_literal_open_bracket)
    
    /**
     * Формирование объявления размера массива.
     * Внутри квадратных скобок ожидаем integer.
     * Записываем полученный размер массива в паспорт 
     * последнего созданного массива (то есть в массив на вершине стека).
     */
    const currentToken = this.getCurrentToken();               
    if (currentToken.type !== TokenType.number_integer) {
        throw new UnexpectedTokenError(currentToken, TokenType.number_integer);
    }
    const arrayPassport = this.generatorState.identifierMap[0] as Array; 
    arrayPassport.size = currentToken.tokenPayload as number;
    this.generatorState.identifierMap[0] = arrayPassport;
    this.incrementTokenPointer();   

    /**
     * Закрываем квадратную скобку
     */
    this.expectToken(TokenType.non_literal_close_bracket);

    this.parseByParser(MoreArraysParser);

    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.identifier, this.handleArrayDefinition]
  ];
}
