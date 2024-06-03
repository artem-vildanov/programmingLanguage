import SubscriptParser from "./SubscriptParser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import ExpressionParser from "./ExpressionParser";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import TermTailParser from "./TermTailParser";

export default class TermParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenParen = () => {
    this.handleOpenParenToken(this.getCurrentToken());
    this.parseByParser(ExpressionParser);
    this.handleCloseParenToken(this.getCurrentToken());
    this.parseByParser(TermTailParser);
    return this.generatorState;
  } 

  private handleIdentifier = () => {
    this.addIdentifierToRPN(this.getCurrentToken());
    this.parseByParser(SubscriptParser);
    this.parseByParser(TermTailParser);
    return this.generatorState;
  } 

  private handleConstant = () => {
    this.addConstantToRPN(this.getCurrentToken());
    this.parseByParser(TermTailParser);
    return this.generatorState;
  } 

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ];

}
