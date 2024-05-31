import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class ElsePartParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.keyword_else, this.handleElse],
    [TokenType.default, this.handleLambda]
  ];

  private handleElse(): GeneratorState {
    return this.generatorState;
  }

  private handleLambda(): GeneratorState {
    return this.generatorState;
  }
}
