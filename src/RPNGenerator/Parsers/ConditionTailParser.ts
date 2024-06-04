import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ExpressionParser from "./ExpressionParser";

export default class ConditionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOperator = () => {
    const operatorToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOperatorToken(operatorToken);
    this.stateManager.incrementTokenPointer();
    this.parseByParser(ExpressionParser);
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.logic_operator_less, this.handleOperator],
    [TokenType.logic_operator_more, this.handleOperator],
    [TokenType.logic_operator_less_or_equal, this.handleOperator],
    [TokenType.logic_operator_more_or_equal, this.handleOperator],
    [TokenType.logic_operator_equality, this.handleOperator],
    [TokenType.logic_operator_unequality, this.handleOperator]
  ]);
}
