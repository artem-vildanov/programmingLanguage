import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class TermTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.math_operator_multiply, this.handleMultiply],
    [TokenType.math_operator_divide, this.handleDivide],
    [TokenType.default, this.handleLambda]
  ];

  private handleMultiply(): GeneratorState {
    return this.generatorState;
  }

  private handleDivide(): GeneratorState {
    return this.generatorState;
  }

  private handleLambda(): GeneratorState {
    return this.generatorState;
  }
}
