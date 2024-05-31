import { TokenType } from "../../LexicalAnalyzer/Token";
import IdentifierDeclared from "../Errors/IdentifierDeclared";
import IdentifierNotDeclared from "../Errors/IdentifierNotDeclared";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import ExpressionParser from "./ExpressionParser";
import SubscriptParser from "./SubscriptParser";

export default class StatementParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  protected generationRules: GenerationRulesTuple = [
    [TokenType.identifier, this.handleAssignment],
    [TokenType.keyword_read, this.handleRead],
    [TokenType.keyword_write, this.handleWrite],
    [TokenType.keyword_if, this.handleIf],
    [TokenType.keyword_while, this.handleWhile],
    [TokenType.default, this.handleLambda] // обработать вариант lambda правила
  ];

  private handleAssignment(): GeneratorState {
    /**
     * добавляем переменную в ОПС,
     * парсим индексирование,
     * сохраяем токен оператора присваивания,
     * парсим выражение которое присваиваем,
     * добавляем присваивание в ОПС,
     * ожидаем точку с запятой,
     * дальше парсим блок выражений
     */

    this.addToRpnAsIdentifier(); // добавляем текущий анализируемый токен как переменную в ОПС
    this.generatorState = this.getParser(SubscriptParser).parse(); // парсим индексирование 
    const assignmentOperator = this.getCurrentToken(); // сохраяем токен оператора присваивания
    this.expectToken(TokenType.logic_operator_assign);
    this.generatorState = this.getParser(ExpressionParser).parse(); // парсим выражение которое присваиваем
    this.addTokenToRpn(assignmentOperator); // добавляем присваивание в ОПС
    this.expectToken(TokenType.non_literal_semicolon); // ожидаем точку с запятой
    this.generatorState = this.getParser(StatementParser).parse(); // дальше парсим блок выражений

    return this.generatorState;
  }

  private handleRead(): GeneratorState {
    const readKeyword = this.getCurrentToken();
    this.expectToken(TokenType.keyword_read);
    this.expectToken(TokenType.non_literal_open_brace);

    return this.generatorState;
  }

  private handleWrite(): GeneratorState {
    return this.generatorState;
  }

  private handleIf(): GeneratorState {

    return this.generatorState;
  }

  private handleWhile(): GeneratorState {

    return this.generatorState;
  }

  private handleLambda(): GeneratorState {

    return this.generatorState;
  }
}
