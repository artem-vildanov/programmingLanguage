import SubscriptParser from "./SubscriptParser";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import ExpressionParser from "./ExpressionParser";
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import TermTailParser from "./TermTailParser";

export default class TermParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenParen = () => {
    const openParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOpenParenToken(openParenToken);

    this.parseByParser(ExpressionParser);

    const closeParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleCloseParenToken(closeParenToken);
    this.parseByParser(TermTailParser);
  } 

  private handleIdentifier = () => {
    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken);
    this.parseByParser(SubscriptParser);
    this.parseByParser(TermTailParser);
  } 

  private handleConstant = () => {
    const constantToken = this.stateManager.getCurrentToken();
    this.rpnManager.addConstantToRPN(constantToken);
    this.parseByParser(TermTailParser);
  } 

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ]);

}
