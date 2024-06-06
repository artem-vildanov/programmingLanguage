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
    /**
     * сохраняем чтобы использовать в качестве границы 
     * для вытягивания операторов из стэка опреторов 
     */
    const openBracket = this.stateManager.getCurrentToken(); 
    this.stateManager.expectToken(TokenType.non_literal_open_bracket);
    
    /** 
     * устанавливаем границу, до которой будут вытягиваться 
     * операторы из стека операторов после парсинга выражения
     */
    this.rpnManager.addSubscriptOperatorsDivider(openBracket);
    this.parseByParser(ExpressionParser);
    /**
     * вытягиваем оставшиеся операторы из стека операторов до ограничителя
     */
    this.rpnManager.addSubscriptOperatorsToRpn();
    
    this.stateManager.expectToken(TokenType.non_literal_close_bracket);
    
    this.rpnManager.addCommandToRpn(RPNCommands.index);
  }

  private handleLambda = () => {}

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.non_literal_open_bracket, this.handleOpenBracket],
    [TokenType.default, this.handleLambda]
  ]);

}
