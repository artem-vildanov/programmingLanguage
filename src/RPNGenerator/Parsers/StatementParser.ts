import Token from '../../LexicalAnalyzer/Models/Token';
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import RPNCommands from "../Enums/RPNCommands";
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import ConditionParser from "./ConditionParser";
import ElsePartParser from "./ElsePartParser";
import ExpressionParser from "./ExpressionParser";
import SubscriptParser from "./SubscriptParser";

export default class StatementParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  /**
   * добавляем переменную в ОПС,
   * парсим индексирование,
   * сохраяем токен оператора присваивания,
   * парсим выражение которое присваиваем,
   * добавляем присваивание в ОПС,
   * ожидаем точку с запятой,
   * дальше парсим блок выражений
   */
  private handleAssignment = () => {
    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken); // добавляем текущий анализируемый токен как переменную в ОПС

    this.parseByParser(SubscriptParser); // парсим индексирование 

    const operatorToken = this.stateManager.getCurrentToken();
    this.rpnManager.handleOperatorToken(operatorToken); // добавляем присваивание в ОПС

    this.stateManager.expectToken(TokenType.logic_operator_assign);
    this.parseByParser(ExpressionParser); // парсим выражение которое присваиваем
    this.rpnManager.addStackOperatorsToRpn();
    this.stateManager.expectToken(TokenType.non_literal_semicolon); // ожидаем точку с запятой
    this.parseByParser(StatementParser); // дальше парсим блок выражений
  }

  /**
   * считываем ключевое слово read,
   * ожидаем открывающую скобку,
   * считываем переменную и добавляем в ОПС,
   * парсим индексирование,
   * ожидаем закрывающую скобку,
   * ожидаем точку с запятой,
   * добавляем операцию read в ОПС,
   * продолжаем парсить блок выражений
   */
  private handleRead = () => {
    this.stateManager.expectToken(TokenType.keyword_read);
    this.stateManager.expectToken(TokenType.non_literal_open_paren); // ожидаем открывающую скобку
    
    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken); // добавляем в ОПС текущий токен в роли идентификатора
    this.parseByParser(SubscriptParser); // парсим индексирование
    this.stateManager.expectToken(TokenType.non_literal_close_paren); // ожидаем закрывающую скобу
    this.stateManager.expectToken(TokenType.non_literal_semicolon); // ожидаем точку с запятой
    this.rpnManager.addCommandToRpn(RPNCommands.read); // добавляем в ОПС опперацию чтения
    this.parseByParser(StatementParser); // дальше парсим блок выражений
  }

  /**
   * считываем ключевое слово write,
   * ожидаем открывающую скобку,
   * считываем переменную и добавляем в ОПС,
   * парсим индексирование,
   * ожидаем закрывающую скобку,
   * ожидаем точку с запятой,
   * добавляем операцию write в ОПС,
   * продолжаем парсить блок выражений
   */
  private handleWrite = () => {
    this.stateManager.expectToken(TokenType.keyword_write);
    this.stateManager.expectToken(TokenType.non_literal_open_paren); // ожидаем открывающую скобку

    const identifierToken = this.stateManager.getCurrentToken();
    this.rpnManager.addIdentifierToRPN(identifierToken); // добавляем в ОПС текущий токен в роли идентификатора
    this.parseByParser(SubscriptParser); // парсим индексирование
    this.stateManager.expectToken(TokenType.non_literal_close_paren); // ожидаем закрывающую скобу
    this.stateManager.expectToken(TokenType.non_literal_semicolon); // ожидаем точку с запятой
    this.rpnManager.addCommandToRpn(RPNCommands.write); // добавляем в ОПС опперацию записи
    this.parseByParser(StatementParser); // дальше парсим блок выражений
  }

  /**
   * ожидаем ключевое слово if,
   * ожидаем открывающую скобу,
   * парсим условное выражение,
   * ожидаем закрывающую скобу,
   * 
   * создаем метку для перехода на блок else,
   * создаем метку для перехода на место после else,
   * создаем указатели меток
   * 
   * добавляем метку else в ОПС,
   * добавляем команду условного перехода jf,
   * 
   * ожидаем открывающую скобку,
   * парсим блок выражений,
   * добавляем метку end в ОПС,
   * добавляем команду безусловного перехода end,
   * ожидаем закрывающую скобку,
   * 
   * добавляем в ОПС указатель метки else (перейдем на нее от команды условного перехода, если в блоке if результат будет false),
   * парсим блок else,
   * 
   * добавляем в ОПС указатель метки end (перейдем на нее от команды безусловного перехода, если в блоке if результат будет true),
   * дальше парсим блок выражений
   */
  private handleIf = () => {
    const elseLabel = this.stateManager.getNewLabel(); // метка перехода на else
    const elseLabelPointer = this.stateManager.getLabelPointer(elseLabel); // указатель на метку else (на нее перейдем)
    const endLabel = this.stateManager.getNewLabel(); // метка перехода на end (после else)
    const endLabelPointer = this.stateManager.getLabelPointer(endLabel); // указатель на метку end 

    this.stateManager.expectToken(TokenType.keyword_if);
    this.stateManager.expectToken(TokenType.non_literal_open_paren);
    this.parseByParser(ConditionParser); // парсим условное выражение
    this.rpnManager.addStackOperatorsToRpn();
    this.stateManager.expectToken(TokenType.non_literal_close_paren);
    
    this.rpnManager.addLabelToRPN(elseLabel); // добавляем метку else 
    this.rpnManager.addCommandToRpn(RPNCommands.jump_if_false); // добавляем команду условного перехода

    this.stateManager.expectToken(TokenType.non_literal_open_brace);
    this.parseByParser(StatementParser); // парсим блок выражений, которые будут выполнены если результат условного выражения равен true
    this.rpnManager.addLabelToRPN(endLabel); // метка перехода end. нужна чтобы пропустить блок else
    this.rpnManager.addCommandToRpn(RPNCommands.jump_anyway_forward); // команда безусловного перехода. пропускаем блок else, прыгаем на указатель метки end
    this.stateManager.expectToken(TokenType.non_literal_close_brace);

    this.rpnManager.addLabelPointerToRPN(elseLabelPointer); // указатель метки else. перейдем на нее если результат условного выражения был false
    this.parseByParser(ElsePartParser); // парсим блок else

    this.rpnManager.addLabelPointerToRPN(endLabelPointer); // добавляем указатель метки end, перейдем на нее когда надо будет пропустить блок else 
    this.parseByParser(StatementParser); // дальше парсим выражения 
  }

  /**
   * генерируем метки и указатели меток,
   * входим в условие цикла,
   * перед условием ставим указатель метки безусловного перехода,
   * парсим условие,
   * 
   * добавляем в ОПС метку для пропуска тела цикла,
   * добавляем в ОПС команду условного перехода,
   * 
   * парсим тело цикла,
   * в конце тела цикла, но не за пределами, добавляем в ОПС метку безусловного перехода обратно к проверке условия цикла,
   * добавляем в ОПС команду безусловного перехода назад к условию цикла,
   * 
   * вне тела цикла добавляем метку условного перехода если не прошло условие цикла,
   * дальше парсим блок выражений
   */
  private handleWhile = () => {
    const backwardLabel = this.stateManager.getNewLabel(); // метка для безусловного перехода (возвращаемся на проверку условия while)
    const backwardLabelPointer = this.stateManager.getLabelPointer(backwardLabel); // указатель на метку безусловного перехода
    const endLabel = this.stateManager.getNewLabel(); // метка условного перехода (перейдем на нее, если результат условного выражения в while == false, пропускаем тело цикла)
    const endLabelPointer = this.stateManager.getLabelPointer(endLabel); // указатель на метку условного перехода

    this.stateManager.expectToken(TokenType.keyword_while);
    this.stateManager.expectToken(TokenType.non_literal_open_paren);
    this.rpnManager.addLabelPointerToRPN(backwardLabelPointer); // добавляем метку для безусловного перехода на нее, чтобы циклично перепроверять условие
    this.parseByParser(ConditionParser); // парсим условное выражение
    this.rpnManager.addStackOperatorsToRpn();
    this.stateManager.expectToken(TokenType.non_literal_close_paren);

    this.rpnManager.addLabelToRPN(endLabel);
    this.rpnManager.addCommandToRpn(RPNCommands.jump_if_false)

    this.stateManager.expectToken(TokenType.non_literal_open_brace);
    this.parseByParser(StatementParser); // парсим блок выражений внутри тела цикла
    this.rpnManager.addLabelToRPN(backwardLabel); // метка для безусловного перехода (назад, к проверке условия while) после выполнения тела цикла
    this.rpnManager.addCommandToRpn(RPNCommands.jump_anyway_backward); // команда для безусловного перехода назад на указатель метки 
    this.stateManager.expectToken(TokenType.non_literal_close_brace);

    this.rpnManager.addLabelPointerToRPN(endLabelPointer); // указатель метки end, переходим на нее если не прошли условие цикла
    this.parseByParser(StatementParser); // парсим дальше
  }

  /**
   * Ничего не делаем
   */
  private handleLambda = () => {}

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.identifier, this.handleAssignment],
    [TokenType.keyword_read, this.handleRead],
    [TokenType.keyword_write, this.handleWrite],
    [TokenType.keyword_if, this.handleIf],
    [TokenType.keyword_while, this.handleWhile],
    [TokenType.default, this.handleLambda] // обработать вариант lambda правила
  ]);

}
