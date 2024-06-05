import TypesIncompatible from "../Errors/TypesIcompatible";
import IdentifierNotDeclared from "../../RPNGenerator/Errors/IdentifierNotDeclared";
import InterpreterState from "../Models/InterpreterState";
import DataType from "../../RPNGenerator/DataTypes/DataType";
import JumpStates from "../Enums/JumpStates";

export default class InterpreterStateManager {
  constructor(private state: InterpreterState) {}

  /** Добавляем элемент на верхушку стека интерпретатора */
  unshiftIntoStack(item: number | DataType | boolean): void {
    this.state.interpreterStack.unshift(item);
  }

  /**
   * удаляет самый верхний элемент из стека интерпретатора,
   * возвращает его;
   */
  shiftFromStack(): DataType | number | boolean {
    const stackItem = this.state.interpreterStack.shift()!;
    return stackItem;
  }

  getTopStackValue(): number | boolean {
    const stackItem = this.shiftFromStack();

    if (stackItem instanceof DataType) {
      return stackItem.value as number;
    }

    return stackItem;
  }

  getIdentifier(identifierName: string): DataType {
    const identifier = this.state.identifiersMap.find(
      (identifier) => identifier.name === identifierName
    );

    if (identifier === undefined) {
      this.throwError(IdentifierNotDeclared, identifierName);
    }

    return identifier!;
  }

  /** Проверка, можно ли присвоить это число в эту переменную: проверка на соответствие типов */
  compareTypes(identifier: DataType, valueToAssign: number): void {
    const identifierIsInteger = identifier.type === "integer";
    const valueToAssignIsInteger = Number.isInteger(valueToAssign);
    if (identifierIsInteger !== valueToAssignIsInteger) {
      this.throwError(TypesIncompatible, identifier, valueToAssign);
    }
  }

  checkIfIdentifierDeclared(identifierName: string): void {
    const result = this.state.identifiersMap.find(
      (identifier) => identifier.name === identifierName
    );
    if (result === undefined) {
      this.throwError(IdentifierNotDeclared, identifierName);
    }
  }

  /** для обработки ошибки */
  throwError<T extends Error>(
    ErrorClass: new (...args: any[]) => T,
    ...args: any[]
  ): CallableFunction {
    console.log(new ErrorClass(...args));
    process.exit(1);
  }

  setJumpTarget(target: string): void {
    const jumpTarget = `${target}_pointer`;
    this.state.jumpTarget = jumpTarget;
  }

  setJumpState(jumpState: JumpStates): void {
    this.state.jumpState = jumpState;
  }

  clearJumpTarget(): void {
    this.state.jumpTarget = null;
  }
}
