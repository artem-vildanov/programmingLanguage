import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import RPNCommands from "../Enums/RPNCommands";
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ExpressionParser from "./ExpressionParser";

export default class SubscriptParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleOpenBracket = () => {
    this.stateManager.expectToken(TokenType.non_literal_open_bracket);
    this.parseByParser(ExpressionParser);
    this.stateManager.expectToken(TokenType.non_literal_close_bracket);
    this.rpnManager.addCommandToRpn(RPNCommands.index);
  }

  private handleLambda = () => {}

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_bracket, this.handleOpenBracket],
    [TokenType.default, this.handleLambda]
  ]);

}
