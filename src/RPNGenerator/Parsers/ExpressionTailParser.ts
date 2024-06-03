import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import TermParser from "./TermParser";

export default class ExpressionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handlePlus = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleMinus = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleLambda = () => {
    return this.generatorState;
  }

  private handleOperator(): void {
    this.handleOperatorToken(this.getCurrentToken());
    this.incrementTokenPointer();
    this.parseByParser(TermParser);
    this.parseByParser(ExpressionTailParser);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.math_operator_plus, this.handlePlus],
    [TokenType.math_operator_minus, this.handleMinus],
    [TokenType.default, this.handleLambda]
  ];
}
