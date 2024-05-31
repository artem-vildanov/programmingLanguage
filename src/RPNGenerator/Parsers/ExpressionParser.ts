import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class ExpressionParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ];

  private handleOpenParen(): GeneratorState {
    return this.generatorState;
  }

  private handleIdentifier(): GeneratorState {
    return this.generatorState;
  }

  private handleConstant(): GeneratorState {
    return this.generatorState;
  }
}
