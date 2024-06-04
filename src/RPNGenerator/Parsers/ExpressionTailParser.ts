import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import TermParser from "./TermParser";

export default class ExpressionTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleLambda = () => {}

  private handleOperator = () => {
    const operatorToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOperatorToken(operatorToken);
    this.stateManager.incrementTokenPointer();
    this.parseByParser(TermParser);
    this.parseByParser(ExpressionTailParser);
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.math_operator_plus, this.handleOperator],
    [TokenType.math_operator_minus, this.handleOperator],
    [TokenType.default, this.handleLambda]
  ]);
}
