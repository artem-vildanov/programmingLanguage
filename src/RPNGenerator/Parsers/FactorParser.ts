import SubscriptParser from "./SubscriptParser";
import ExpressionParser from "./ExpressionParser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class FactorParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleOpenParen = () => {
    this.handleOpenParenToken(this.getCurrentToken());
    this.parseByParser(ExpressionParser);
    this.handleCloseParenToken(this.getCurrentToken());
    return this.generatorState;
  } 

  private handleIdentifier = () => {
    this.addIdentifierToRPN(this.getCurrentToken());
    this.parseByParser(SubscriptParser);
    return this.generatorState;
  } 

  private handleConstant = () => {
    this.addConstantToRPN(this.getCurrentToken());
    return this.generatorState;
  } 

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ];
}
