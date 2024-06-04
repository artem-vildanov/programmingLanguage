import Token from '../../LexicalAnalyzer/Models/Token';
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import IdentifierNotDeclared from "../Errors/IdentifierNotDeclared";
import UnexpectedTokenError from "../Errors/UnexpectedTokenError";
import RPNItem from "../Models/RPNItem";
import GeneratorState from "../Models/GeneratorState";
import OperatorsPrecedence from "../Enums/OperatorsPrecedence";
import RPNCommands from "../Enums/RPNCommands";
import RPNItemTypes from "../Enums/RPNItemTypes";

export default class RpnManager {
  constructor(private generatorState: GeneratorState) {}

  /**
   * Добавляем текущий токен в ОПС
   * в роли идентификатора;
   */
  addIdentifierToRPN(token: Token): void {
    if (token.type !== TokenType.identifier) {
      throw new UnexpectedTokenError(token, TokenType.identifier);
    }
    this.checkIdentifierDeclared(token.tokenPayload as string)
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.identifier,
      value: token.tokenPayload,
      token: token,
    };
    this.addItemToRpn(rpnItem);
    this.incrementTokenPointer();
  }

  addConstantToRPN(token: Token): void {
    if (
      token.type !== TokenType.number_integer &&
      token.type !== TokenType.number_float
    ) {
      throw new UnexpectedTokenError(token, TokenType.number_integer);
    }
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.constant,
      value: token.tokenPayload,
      token: token,
    };
    this.addItemToRpn(rpnItem);
    this.incrementTokenPointer();
  }

  addCommandToRpn(command: RPNCommands): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.command,
      value: command,
      token: null,
    };
    this.addItemToRpn(rpnItem);
  }

  addLabelToRPN(label: string): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.label,
      value: label,
      token: null,
    };
    this.addItemToRpn(rpnItem);
  }

  addLabelPointerToRPN(labelPointer: string): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.label_pointer,
      value: labelPointer,
      token: null,
    };
    this.addItemToRpn(rpnItem);
  }


  handleOperatorToken(operatorToken: Token): void {
    while (
      this.generatorState.operatorsStack.length && 
      this.compareOperatorPrecedence(operatorToken)
    ) {
      const topStackOperator = this.generatorState.operatorsStack.shift()!;
      this.addOperatorToRpn(topStackOperator);
    }
    this.addOperatorToStack(operatorToken);
  }

  handleOpenParenToken(parenToken: Token): void {
    if (parenToken.type !== TokenType.non_literal_open_paren) {
      throw new UnexpectedTokenError(parenToken, TokenType.non_literal_open_paren);
    }
    this.addOperatorToStack(parenToken);
    this.incrementTokenPointer();
  }

  handleCloseParenToken(parenToken: Token): void {
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
    this.generatorState.operatorsStack.shift(); // удаляем ( из стэка
    this.incrementTokenPointer();
  }

  addStackOperatorsToRpn(): void {
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
    const topStackOperatorPrecedence = OperatorsPrecedence[topStackOperator];
    const analyzedOperatorPrecedence = OperatorsPrecedence[operator];
    if (analyzedOperatorPrecedence === undefined) {
      throw new UnexpectedTokenError(
        operatorToken, 
        TokenType.math_operator_divide,
        TokenType.math_operator_minus,
        TokenType.math_operator_multiply,
        TokenType.math_operator_plus,
        TokenType.logic_operator_equality,
        TokenType.logic_operator_less,
        TokenType.logic_operator_less_or_equal,
        TokenType.logic_operator_more, 
        TokenType.logic_operator_more_or_equal, 
        TokenType.logic_operator_unequality, 
        TokenType.logic_operator_assign,
      )
    }
    return topStackOperatorPrecedence >= analyzedOperatorPrecedence;
  }

  private addOperatorToRpn(token: Token): void {
    const rpnItem: RPNItem = {
      itemType: RPNItemTypes.operator,
      value: token.tokenPayload,
      token: token,
    };
    this.addItemToRpn(rpnItem);
  }

  private addItemToRpn(item: RPNItem): void {
    this.generatorState.generatedRPN.push(item);
  }

  private checkIdentifierDeclared(name: string): void {
    const result = this.generatorState.identifierMap.find(identifier => identifier.name === name);
    if (result === undefined) {
      throw new IdentifierNotDeclared(name);
    }
  }

  private incrementTokenPointer(): void {
    this.generatorState.tokenPointer++
  }

  private addOperatorToStack(operator: Token): void {
    this.generatorState.operatorsStack.unshift(operator);
  }
}
