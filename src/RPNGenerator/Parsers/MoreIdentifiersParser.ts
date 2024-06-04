import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import IdentifierMapState from "../Enums/IdentifierMapState";
import IdentifierDeclarationParser from "./IdentifierDeclarationParser";

export default class MoreIdentifiersParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleIdentifierDefinition = () => {
    this.stateManager.expectToken(TokenType.non_literal_comma);
    this.parseByParser(IdentifierDeclarationParser);
  }

  private handleSemicolon = () => {
    this.stateManager.setIdentifierMapState(IdentifierMapState.not_stated);
    this.stateManager.incrementTokenPointer();
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_comma, this.handleIdentifierDefinition],
    [TokenType.non_literal_semicolon, this.handleSemicolon]
  ]);
}
