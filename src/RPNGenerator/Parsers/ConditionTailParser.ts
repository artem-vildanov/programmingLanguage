import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class ConditionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.logic_operator_less, this.handleLess],
    [TokenType.logic_operator_more, this.handleMore],
    [TokenType.logic_operator_less_or_equal, this.handleLessOrEqual],
    [TokenType.logic_operator_more_or_equal, this.handleMoreOrEqual],
    [TokenType.logic_operator_equality, this.handleEqual],
    [TokenType.logic_operator_unequality, this.handleNotEqual]
  ];

  private handleLess(): GeneratorState {
    return this.generatorState;
  }

  private handleMore(): GeneratorState {
    return this.generatorState;
  }

  private handleLessOrEqual(): GeneratorState {
    return this.generatorState;
  }

  private handleMoreOrEqual(): GeneratorState {
    return this.generatorState;
  }

  private handleEqual(): GeneratorState {
    return this.generatorState;
  }

  private handleNotEqual(): GeneratorState {
    return this.generatorState;
  }
}
