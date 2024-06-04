import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import StatementParser from "./StatementParser";

export default class ElsePartParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleElse = () => {
    this.stateManager.expectToken(TokenType.keyword_else);
    this.stateManager.expectToken(TokenType.non_literal_open_brace);
    this.parseByParser(StatementParser);
    this.stateManager.expectToken(TokenType.non_literal_close_brace);
  }

  private handleLambda = () => {}

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.keyword_else, this.handleElse],
    [TokenType.default, this.handleLambda]
  ]);
}
