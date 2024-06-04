import SubscriptParser from "./SubscriptParser";
import ExpressionParser from "./ExpressionParser";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";

export default class FactorParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleOpenParen = () => {
    const openParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOpenParenToken(openParenToken);
    this.parseByParser(ExpressionParser);
    const closeParenToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleCloseParenToken(closeParenToken);
  } 

  private handleIdentifier = () => {
    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken);
    this.parseByParser(SubscriptParser);
  } 

  private handleConstant = () => {
    const constantToken = this.stateManager.getCurrentToken();
    this.rpnManager.addConstantToRPN(constantToken);
  } 

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ]);
}
