import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class ExpressionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.math_operator_plus, this.handlePlus],
    [TokenType.math_operator_minus, this.handleMinus],
    [TokenType.default, this.handleLambda]
  ];

  private handlePlus(): GeneratorState {
    return this.generatorState;
  }

  private handleMinus(): GeneratorState {
    return this.generatorState;
  }

  private handleLambda(): GeneratorState {
    return this.generatorState;
  }
}
