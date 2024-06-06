import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ConditionTailParser from "./ConditionTailParser";
import ExpressionParser from "./ExpressionParser";
import ExpressionTailParser from "./ExpressionTailParser";
import SubscriptParser from "./SubscriptParser";
import TermTailParser from "./TermTailParser";

export default class ConditionParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenParen = () => {
    this.rpnManager.handleOpenParenToken(this.stateManager.getCurrentToken());
    this.parseByParser(ExpressionParser);
    this.rpnManager.handleCloseParenToken(this.stateManager.getCurrentToken());
    this.parseTails();
  }

  private handleIdentifier = () => {
    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken);
    this.parseByParser(SubscriptParser);
    this.parseTails();
  }

  private handleConstant = () => {
    const constantToken = this.stateManager.getCurrentToken();
    this.rpnManager.addConstantToRPN(constantToken);
    this.parseTails();
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant]
  ]);

  /**
   * parse TermTail, ExpressionTail, ConditionTail;
   * 
   * result in generatorState; 
   */
  private parseTails(): void {
    this.parseByParser(TermTailParser);
    this.parseByParser(ExpressionTailParser);
    this.parseByParser(ConditionTailParser);
  }
}
