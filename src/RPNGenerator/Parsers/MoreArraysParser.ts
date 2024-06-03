import { IdentifierMapState } from "../Generator";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import ArrayDeclarationParser from "./ArrayDeclarationParser";

export default class MoreArraysParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleArrayDefinition = () => {
    this.expectToken(TokenType.non_literal_comma);
    this.parseByParser(ArrayDeclarationParser);
    return this.generatorState;
  }

  // semicolon symbol
  private handleSemicolon = () => {
    this.generatorState.identifierMapState = IdentifierMapState.not_stated;
    this.incrementTokenPointer();
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_comma, this.handleArrayDefinition],
    [TokenType.non_literal_semicolon, this.handleSemicolon]
  ];
}
