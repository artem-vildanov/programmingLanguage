import read from "../Utils/read";
import RPNCommands from "../../RPNGenerator/Enums/RPNCommands";
import RPNItem from "../../RPNGenerator/Models/RPNItem";
import InterpreterState from "../Models/InterpreterState";
import InterpreterStateManager from "../Managers/InterpreterStateManager";
import IHandler from "./IHandler";
import TypesIncompatible from "../Errors/TypesIcompatible";
import RPNItemTypes from "../../RPNGenerator/Enums/RPNItemTypes";
import DataType from "../../RPNGenerator/DataTypes/DataType";
import OutOfRange from "../Errors/OutOfRange";
import JumpStates from "../Enums/JumpStates";
import UnexpectedTokenError from "../../RPNGenerator/Errors/UnexpectedTokenError";
import NotArray from "../Errors/NotArray";
import UnexpectedIndexValue from "../Errors/UnexpectedIndexValue";

export default class CommandHandler implements IHandler {
  private stateManager: InterpreterStateManager;
  constructor(state: InterpreterState) {
    this.stateManager = new InterpreterStateManager(state);
  }

  async handle(rpnItem: RPNItem): Promise<void> {
    const callableHandler = this.findHandler(rpnItem.value as string);
    await callableHandler();
  }

  private findHandler(command: string): CallableFunction {
    const callableHandler = this.commandsHandlers.get(command as RPNCommands)!;
    return callableHandler;
  }

  private handleRead = async () => {
    const identifier = this.stateManager.shiftFromStack() as DataType;
    /** Записываем в эту переменную введенное значение */ 
    const inputNumber = await read();
    this.stateManager.compareTypes(identifier, inputNumber)
    identifier.value = inputNumber;
  };

  private handleWrite = () => {
    const valueToWrite = this.stateManager.getTopStackValue();
    console.log(`output: ${valueToWrite}`);
  };

  private handleJumpAnywayForward = () => {
    this.stateManager.setJumpState(JumpStates.jump_forward);
  };

  private handleJumpAnywayBackward = () => {
    this.stateManager.setJumpState(JumpStates.jump_backward);
  };

  private handleJumpIfFalse = () => {
    const conditionResult = this.stateManager.getTopStackValue() as boolean;
    if (!conditionResult) {
      this.stateManager.setJumpState(JumpStates.jump_forward);
    }
  };

  private handleIndex = () => {
    const cellIndex = this.stateManager.getTopStackValue() as number;
    const arrayIdentifier = this.stateManager.shiftFromStack() as DataType;

    if (!Number.isInteger(cellIndex)) {
      this.stateManager.throwError(UnexpectedIndexValue, cellIndex);
    }

    if (arrayIdentifier.type !== 'array') {
      this.stateManager.throwError(NotArray, arrayIdentifier.name);
    }

    const arrayBody = arrayIdentifier.value as DataType[];
    
    if (arrayBody.length - 1 < cellIndex) {
      this.stateManager.throwError(OutOfRange, arrayIdentifier.name, cellIndex);
    }

    this.stateManager.unshiftIntoStack(arrayBody[cellIndex] as DataType);
  };

  private commandsHandlers: Map<RPNCommands, CallableFunction> = new Map([
    [RPNCommands.index, this.handleIndex],
    [RPNCommands.jump_anyway_backward, this.handleJumpAnywayBackward],
    [RPNCommands.jump_anyway_forward, this.handleJumpAnywayForward],
    [RPNCommands.jump_if_false, this.handleJumpIfFalse],
    [RPNCommands.read, this.handleRead],
    [RPNCommands.write, this.handleWrite],
  ]);
}
