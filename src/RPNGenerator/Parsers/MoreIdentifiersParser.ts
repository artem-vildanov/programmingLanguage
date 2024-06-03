import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import { IdentifierMapState } from "../Generator";
import IdentifierDeclarationParser from "./IdentifierDeclarationParser";

export default class MoreIdentifiersParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleIdentifierDefinition = () => {
    this.expectToken(TokenType.non_literal_comma);
    this.parseByParser(IdentifierDeclarationParser);
    return this.generatorState;
  }

  private handleSemicolon = () => {
    this.generatorState.identifierMapState = IdentifierMapState.not_stated;
    this.incrementTokenPointer();
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_comma, this.handleIdentifierDefinition],
    [TokenType.non_literal_semicolon, this.handleSemicolon]
  ]

}
