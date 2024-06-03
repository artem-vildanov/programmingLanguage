import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import FactorParser from "./FactorParser";

export default class TermTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleMultiply = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleDivide = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleLambda = () => {
    return this.generatorState;
  }

  private handleOperator(): void {
    this.handleOperatorToken(this.getCurrentToken());
    this.incrementTokenPointer();
    this.parseByParser(FactorParser);
    this.parseByParser(TermTailParser);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.math_operator_multiply, this.handleMultiply],
    [TokenType.math_operator_divide, this.handleDivide],
    [TokenType.default, this.handleLambda]
  ];

}
