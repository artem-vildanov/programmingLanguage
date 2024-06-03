import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState, RPNCommands } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import ExpressionParser from "./ExpressionParser";

export default class SubscriptParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenBracket = () => {
    this.expectToken(TokenType.non_literal_open_bracket);
    this.parseByParser(ExpressionParser);
    this.expectToken(TokenType.non_literal_close_bracket);
    this.addCommandToRpn(RPNCommands.index);
    return this.generatorState;
  }

  private handleLambda = () => {
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.non_literal_open_bracket, this.handleOpenBracket],
    [TokenType.default, this.handleLambda]
  ];

}
