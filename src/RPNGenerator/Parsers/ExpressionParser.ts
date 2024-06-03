import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import ExpressionTailParser from "./ExpressionTailParser";
import SubscriptParser from "./SubscriptParser";
import TermTailParser from "./TermTailParser";

export default class ExpressionParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenParen = () => {
    this.handleOpenParenToken(this.getCurrentToken());
    this.parseByParser(ExpressionParser);
    this.handleCloseParenToken(this.getCurrentToken());
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

  private parseTails(): void {
    this.parseByParser(TermTailParser);
    this.parseByParser(ExpressionTailParser);
    
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_paren, this.handleOpenParen],
    [TokenType.identifier, this.handleIdentifier],
    [TokenType.number_float, this.handleConstant],
    [TokenType.number_integer, this.handleConstant],
  ];
}
