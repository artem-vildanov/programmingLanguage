import { TokenType } from "../../LexicalAnalyzer/Enums/TokenType";
import DataType from "../../RPNGenerator/DataTypes/DataType";
import RPNItem from "../../RPNGenerator/Models/RPNItem";
import DivideByZero from "../Errors/DivideByZero";
import InterpreterStateManager from "../Managers/InterpreterStateManager";
import InterpreterState from "../Models/InterpreterState";
import IHandler from "./IHandler";

export default class OperatorHandler implements IHandler {
  private stateManager: InterpreterStateManager;
  constructor(state: InterpreterState) {
    this.stateManager = new InterpreterStateManager(state);
  }

  handle(rpnItem: RPNItem): void {
    const callableHandler = this.findHandler(rpnItem.value as string);
    callableHandler();
  }

  private findHandler(operator: string): CallableFunction {
    const callableHandler = this.operatorsHandlers.get(operator as TokenType)!;
    return callableHandler;
  }

  private handlePlus = () => {
    const secondOperand = this.stateManager.getTopStackValue() as number;
    const firstOperand = this.stateManager.getTopStackValue() as number;
    const resultValue = firstOperand + secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleMinus = () => {
    const secondOperand = this.stateManager.getTopStackValue() as number;
    const firstOperand = this.stateManager.getTopStackValue() as number;
    const resultValue = firstOperand - secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleMultiply = () => {
    const secondOperand = this.stateManager.getTopStackValue() as number;
    const firstOperand = this.stateManager.getTopStackValue() as number;
    const resultValue = firstOperand * secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleDivide = () => {
    const secondOperand = this.stateManager.getTopStackValue() as number;
    const firstOperand = this.stateManager.getTopStackValue() as number;
    
    if (secondOperand === 0) {
      this.stateManager.throwError(DivideByZero);
    }

    const resultValue = firstOperand / secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleAssign = () => {
    const valueToAssign = this.stateManager.getTopStackValue() as number;
    const assignmentTarget = this.stateManager.shiftFromStack() as DataType;
    this.stateManager.compareTypes(assignmentTarget, valueToAssign);
    assignmentTarget.value = valueToAssign;
  }

  private handleLess = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand < secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleMore = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand > secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleLessOrEqual = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand <= secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleMoreOrEqual = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand >= secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleEquality = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand == secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private handleUnequality = () => {
    const secondOperand = this.stateManager.getTopStackValue();
    const firstOperand = this.stateManager.getTopStackValue();
    const resultValue = firstOperand !== secondOperand;
    this.stateManager.unshiftIntoStack(resultValue);
  }

  private operatorsHandlers: Map<TokenType, CallableFunction> = new Map([
    [TokenType.math_operator_plus, this.handlePlus],
    [TokenType.math_operator_minus, this.handleMinus],
    [TokenType.math_operator_multiply, this.handleMultiply],
    [TokenType.math_operator_divide, this.handleDivide],
    [TokenType.logic_operator_less, this.handleLess],
    [TokenType.logic_operator_more, this.handleMore],
    [TokenType.logic_operator_assign, this.handleAssign],
    [TokenType.logic_operator_less_or_equal, this.handleLessOrEqual],
    [TokenType.logic_operator_more_or_equal, this.handleMoreOrEqual],
    [TokenType.logic_operator_equality, this.handleEquality],
    [TokenType.logic_operator_unequality, this.handleUnequality]
  ]);
}
