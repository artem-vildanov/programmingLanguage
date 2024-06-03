import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import ExpressionParser from "./ExpressionParser";

export default class ConditionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleLess = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleMore = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleLessOrEqual = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleMoreOrEqual = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleEqual = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleNotEqual = () => {
    this.handleOperator();
    return this.generatorState;
  }

  private handleOperator(): void {
    const operator = this.getCurrentToken();
    this.incrementTokenPointer();
    this.parseByParser(ExpressionParser);
    this.handleOperatorToken(operator);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.logic_operator_less, this.handleLess],
    [TokenType.logic_operator_more, this.handleMore],
    [TokenType.logic_operator_less_or_equal, this.handleLessOrEqual],
    [TokenType.logic_operator_more_or_equal, this.handleMoreOrEqual],
    [TokenType.logic_operator_equality, this.handleEqual],
    [TokenType.logic_operator_unequality, this.handleNotEqual]
  ];
}
