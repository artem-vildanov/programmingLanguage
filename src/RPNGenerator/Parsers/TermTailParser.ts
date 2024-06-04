import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import FactorParser from "./FactorParser";

export default class TermTailParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleLambda = () => {}

  private handleOperator = () => {
    const operatorToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOperatorToken(operatorToken);
    this.stateManager.incrementTokenPointer();
    this.parseByParser(FactorParser);
    this.parseByParser(TermTailParser);
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.math_operator_multiply, this.handleOperator],
    [TokenType.math_operator_divide, this.handleOperator],
    [TokenType.default, this.handleLambda]
  ]);

}
