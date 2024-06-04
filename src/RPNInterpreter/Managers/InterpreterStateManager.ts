import IdentifierNotDeclared from "../../RPNGenerator/Errors/IdentifierNotDeclared";
import RPNItem from "../../RPNGenerator/Models/RPNItem";
import InterpreterState from "../Models/InterpreterState";

export default class InterpreterStateManager {
  constructor(private state: InterpreterState) {}

  /** Добавляем элемент на верхушку стека интерпретатора */
  unshiftIntoStack(item: RPNItem): void {
    this.state.interpreterStack.unshift(item);
  }

  /**
   * удаляет самый верхний элемент из стека интерпретатора, 
   * возвращает его;
   */
  shiftFromStack(): RPNItem {
    const stackItem = this.state.interpreterStack.shift()
    if (stackItem === undefined) {
      throw new Error('stack is empty, no items to shift');
    }

    return stackItem;
  }

  getIdentifierValue(identifierName: string): number {
    const identifier = this.state.identifiersMap.find(identifier => identifier.name === identifierName);
    if (identifier === undefined) {
      throw new IdentifierNotDeclared(identifierName);
    }

    return identifier.value as number;
  }

  /**
   * установить новое значение у переменной с указанным именем
   * @param identifierName имя переменной
   * @param newValue значение переменной, которое надо установить 
   */
  setIdentifierValue(identifierName: string, newValue: number): void {
    const identifierIndex = this.state.identifiersMap.findIndex(
      (identifierFromMap) =>
        identifierFromMap.name === identifierName
    );

    if (identifierIndex === -1) {
      throw new Error(
        `Identifier ${identifierName} not found in identifiersMap`
      );
    }

    this.state.identifiersMap[identifierIndex].value = newValue;
  }

  checkIfIdentifierDeclared(identifierName: string): void {
    const result = this.state.identifiersMap.find(identifier => identifier.name === identifierName);
    if (result === undefined) {
      throw new IdentifierNotDeclared(identifierName);
    }
  }
}
