import { IdentifierMapState, OperatorsPrecedence, RPNCommands, RPNItem, RPNItemTypes } from "./Generator";
import Array from "./DataTypes/Array";
import Float from "./DataTypes/Float";
import Integer from "./DataTypes/Integer";
import Token, { TokenType } from "../LexicalAnalyzer/Token";
import UnexpectedTokenError from "./Errors/UnexpectedTokenError";
import { GeneratorState } from "./Generator";
import IdentifierDeclared from "./Errors/IdentifierDeclared";
import IdentifierNotDeclared from "./Errors/IdentifierNotDeclared";

export type GenerationRulesTuple = [TokenType, CallableFunction][];

export default abstract class Parser {

  constructor(protected generatorState: GeneratorState) { }
  
  /**
   * Ассоциативный массив порождающих правил;
   * Ключ - терминальный символ, с которого начинается порождающее правило;
   * Значение - коллбэк, который распарсит входную цепочку 
   * согласно соответствующему порождающему правилу;
   */
  protected abstract generationRules: GenerationRulesTuple;

  /**
   * Создаем парсер и парсим им порождающие правила. Результат сохраняется в generatorState; 
   * @param stateClass класс парсера
   */
  protected parseByParser<T extends Parser>(stateClass: new (generatorState: GeneratorState) => T): void {
    this.generatorState = new stateClass(this.generatorState).parse();
  }

  /**
   * Получаем текущий анализируемый токен(терминальный символ). 
   * Ищем порождающее правило, которое начинается с этого терминального символа.
   * Вызываем соответствующее правило. 
   */
  public parse(): GeneratorState {
    const token = this.getCurrentToken();
    const callable = this.findRuleByToken(token);
    const result = callable(); 
    // console.log(this.generatorState.operatorsStack);
    return result;
  }

  /**
   * Ищем порождающее правило по токену (терминалу) 
   */
  private findRuleByToken(inputToken: Token): CallableFunction {
    let rule = this.generationRules.find(([type, handler]) => type === inputToken.type);
    if (rule === undefined) {
      /**
       * Ищем lambda rule
       */
      rule = this.generationRules.find(([type, handler]) => type === TokenType.default);
      if (rule === undefined) {
        throw new UnexpectedTokenError(inputToken, TokenType.default);
      }
      return rule[1]; 
    }
    return rule[1];
  }


  protected incrementTokenPointer(): number {
    return this.generatorState.tokenPointer++;
  }

  protected incrementLabelCount(): number {
    return this.generatorState.labelCount++;
  }

  protected getNewLabel(): string {
    return `label_${this.incrementLabelCount()}`;
  }

  protected getLabelPointer(label: string): string {
    return `${label}_pointer`;
  }

  /**
   * Проверка типа текущего токена на соответсвтие ожидаемому типу. 
   * При соответствии перемещает указатель на следующий токен. 
   */
  protected expectToken(expectedTokenType: TokenType): void {
    const current = this.getCurrentToken().type;
    const expected = expectedTokenType as string;
    if (current !== expected) {
      throw new UnexpectedTokenError(this.getCurrentToken(), expectedTokenType);
    }
    this.incrementTokenPointer();
  }

  /**
   * Добавляем текущий токен в ОПС
   * в роли идентификатора;
   */
  protected addIdentifierToRPN(token: Token): void {
    if (token.type !== TokenType.identifier) {
      throw new UnexpectedTokenError(token, TokenType.identifier);
    }
    if (!this.checkIdentifierDeclared(token.tokenPayload as string)) {
      throw new IdentifierNotDeclared(token.tokenPayload as string);
    }
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.identifier,
      value: token.tokenPayload,
      token: token
    }
    this.addItemToRpn(rpnItem);
    this.incrementTokenPointer();
  }

  protected addConstantToRPN(token: Token): void {
    if (token.type !== TokenType.number_integer && token.type !== TokenType.number_float) {
      throw new UnexpectedTokenError(token, TokenType.number_integer);
    }
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.constant,
      value: token.tokenPayload,
      token: token
    }
    this.addItemToRpn(rpnItem);
    this.incrementTokenPointer();
  }

  protected addCommandToRpn(command: RPNCommands): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.command,
      value: command,
      token: null
    }
    this.addItemToRpn(rpnItem);
  }

  protected addLabelToRPN(label: string): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.label,
      value: label,
      token: null
    }
    this.addItemToRpn(rpnItem);
  }

  protected addLabelPointerToRPN(labelPointer: string): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.label_pointer,
      value: labelPointer,
      token: null
    }
    this.addItemToRpn(rpnItem);
  }

  private addOperatorToRpn(token: Token): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.operator,
      value: token.tokenPayload,
      token: token
    }
    this.addItemToRpn(rpnItem);
  }
  
  private addItemToRpn(item: RPNItem): void {
    this.generatorState.generatedRPN.push(item);
  }

  protected getCurrentToken(): Token {
    return this.generatorState.tokens[this.generatorState.tokenPointer];
  }

  /**
   * Добавление переменных в таблицы переменных.
   * Переменные добавляются в начало массива.
   */
  protected addCurrentTokenToIdentifiersMap(): void {
    const token = this.getCurrentToken();
    this.validateIdentifier(token);
    switch (this.generatorState.identifierMapState) {
      case IdentifierMapState.write_integer:
        this.generatorState.identifierMap.unshift(new Integer(token.tokenPayload as string));           
        break;
      case IdentifierMapState.write_float:
        this.generatorState.identifierMap.unshift(new Float(token.tokenPayload as string)); 
        break;
      case IdentifierMapState.write_array:
        this.generatorState.identifierMap.unshift(new Array(token.tokenPayload as string));            
        break;
      case IdentifierMapState.not_stated:
        throw new Error('identifier map state === not_stated');
    }
  }

  private validateIdentifier(token: Token): void {
    if (token.type !== TokenType.identifier) {
      throw new UnexpectedTokenError(token, TokenType.identifier);
    }
    if (this.checkIdentifierDeclared(token.tokenPayload as string)) {
      throw new IdentifierDeclared(token.tokenPayload as string);
    }
  }

  private checkIdentifierDeclared(name: string): boolean {
    const result = this.generatorState.identifierMap.find(identifier => identifier.name === name);
    if (result === undefined) {
      return false;
    }
    return true;
  }

  private addOperatorToStack(operator: Token): void {
    this.generatorState.operatorsStack.unshift(operator);
  }

  // protected handleLogicOperatorToken(operatorToken: Token): void {
  //   this.addOperatorToRpn(operatorToken);
  // }

  protected handleOperatorToken(operatorToken: Token): void {
    while (
      this.generatorState.operatorsStack.length && 
      this.compareOperatorPrecedence(operatorToken)
    ) {
      const topStackOperator = this.generatorState.operatorsStack.shift()!;
      this.addOperatorToRpn(topStackOperator);
    }
    this.addOperatorToStack(operatorToken);
  }

  protected handleOpenParenToken(parenToken: Token): void {
    if (parenToken.type !== TokenType.non_literal_open_paren) {
      throw new UnexpectedTokenError(parenToken, TokenType.non_literal_open_paren);
    }
    this.addOperatorToStack(parenToken);
    this.incrementTokenPointer();
  }

  protected handleCloseParenToken(parenToken: Token): void {
    if (parenToken.type !== TokenType.non_literal_close_paren) {
      throw new UnexpectedTokenError(parenToken, TokenType.non_literal_close_paren);
    }
    while (
      // this.generatorState.operatorsStack.length &&
      this.generatorState.operatorsStack[0].type !== TokenType.non_literal_open_paren 
    ) {
      const topStackOperator = this.generatorState.operatorsStack.shift()!;
      this.addOperatorToRpn(topStackOperator);
    }
    console.log(this.generatorState.operatorsStack.shift()); // удаляем ( из стэка
    this.incrementTokenPointer();
  }

  protected addStackOperatorsToRpn(): void {
    while(this.generatorState.operatorsStack.length) {
      const topStackOperator = this.generatorState.operatorsStack.shift()!;
      this.addOperatorToRpn(topStackOperator);
    }
  }
  
  /**
   * Эта проверка сравнивает приоритет оператора на вершине стека operatorsStack 
   * с приоритетом текущего оператора operatorToken. Если приоритет оператора
   * на вершине стека выше или равен приоритету текущего оператора, то условие выполняется. 
   * Приоритеты операторов заданы в объекте OperatorsPrecedence
   */
  private compareOperatorPrecedence(operatorToken: Token): boolean {
    const topStackOperator = this.generatorState.operatorsStack[0].tokenPayload as string;
    const operator = operatorToken.tokenPayload as string;
    return OperatorsPrecedence[topStackOperator] >= OperatorsPrecedence[operator];
  }
}