import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
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
    this.handleOpenParen();
    this.parseByParser(ExpressionParser);
    this.expectToken(TokenType.non_literal_close_paren);
    this.parseTails();
    return this.generatorState;
  }

  private handleIdentifier = () => {
    this.addIdentifierToRPN(this.getCurrentToken());
    this.parseByParser(SubscriptParser);
    this.parseTails();
    return this.generatorState;
  }

  private handleConstant = () => {
    this.addConstantToRPN(this.getCurrentToken());
    this.parseTails();
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant]
  ];

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
