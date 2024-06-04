import IdentifierMapState from "../Enums/IdentifierMapState";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ArrayDeclarationParser from "./ArrayDeclarationParser";

export default class MoreArraysParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleArrayDefinition = () => {
    this.stateManager.expectToken(TokenType.non_literal_comma);
    this.parseByParser(ArrayDeclarationParser);
  }

  private handleSemicolon = () => {
    this.stateManager.setIdentifierMapState(IdentifierMapState.not_stated);
    this.stateManager.incrementTokenPointer();
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_comma, this.handleArrayDefinition],
    [TokenType.non_literal_semicolon, this.handleSemicolon]
  ]);
}
