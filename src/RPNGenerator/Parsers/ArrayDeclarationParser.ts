import MoreArraysParser from "./MoreArraysParser";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";

export default class ArrayDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleArrayDefinition = () => {
    const arrayIdentifier = this.stateManager.getCurrentToken();
    this.stateManager.addToIdentifiersMap(arrayIdentifier);
    this.stateManager.incrementTokenPointer();

    /** 
     * Ожидаем отрывающей квадратной скобки для объявления размера массива 
     */
    this.stateManager.expectToken(TokenType.non_literal_open_bracket)
    
    /**
     * Формирование объявления размера массива.
     * Внутри квадратных скобок ожидаем integer.
     * Записываем полученный размер массива в паспорт 
     * последнего созданного массива (то есть в массив на вершине стека).
     */
    const arraySizeToken = this.stateManager.getCurrentToken();               
    this.stateManager.setArraySize(arraySizeToken);
    this.stateManager.incrementTokenPointer();

    /**
     * Закрываем квадратную скобку
     */
    this.stateManager.expectToken(TokenType.non_literal_close_bracket);

    this.parseByParser(MoreArraysParser);

  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.identifier, this.handleArrayDefinition]
  ]);
}
