import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class SubscriptParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_bracket, this.handleOpenBracket],
    [TokenType.default, this.handleLambda]
  ];

  private handleOpenBracket(): GeneratorState {
    return this.generatorState;
  }

  private handleLambda(): GeneratorState {
    return this.generatorState;
  }
}
