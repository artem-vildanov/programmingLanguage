import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import StatementParser from "./StatementParser";

export default class ElsePartParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleElse = () => {
    this.expectToken(TokenType.keyword_else);
    this.expectToken(TokenType.non_literal_open_brace);
    this.parseByParser(StatementParser);
    this.expectToken(TokenType.non_literal_close_brace);
    return this.generatorState;
  }

  private handleLambda = () => {
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.keyword_else, this.handleElse],
    [TokenType.default, this.handleLambda]
  ];
}
