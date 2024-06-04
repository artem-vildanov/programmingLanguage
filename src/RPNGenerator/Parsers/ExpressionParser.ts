import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ExpressionTailParser from "./ExpressionTailParser";
import SubscriptParser from "./SubscriptParser";
import TermTailParser from "./TermTailParser";

export default class ExpressionParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenParen = () => {
    const openParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOpenParenToken(openParenToken);
    this.parseByParser(ExpressionParser);
    const closeParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleCloseParenToken(closeParenToken);
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

  private parseTails(): void {
    this.parseByParser(TermTailParser);
    this.parseByParser(ExpressionTailParser);
    
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ]);
}
