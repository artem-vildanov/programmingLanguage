import read from "../Utils/read";
import RPNCommands from "../../RPNGenerator/Enums/RPNCommands";
import RPNItem from "../../RPNGenerator/Models/RPNItem";
import InterpreterState from "../Models/InterpreterState";
import InterpreterStateManager from "../Managers/InterpreterStateManager";
import IHandler from "./IHandler";

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
    const callableHandler = this.commandsHandlers.get(command as RPNCommands);
    if (callableHandler === undefined) {
      throw new Error(
        `callable command handler not found, command [ ${command} ]`
      );
    }

    return callableHandler;
  }

  private handleRead = async () => {
    const identifierName = this.stateManager.shiftFromStack().value as string;
    /** Записываем в эту переменную введенное значение */
    const inputNumber = await read();
    this.stateManager.setIdentifierValue(identifierName, inputNumber);
  };

  private handleWrite = () => {
    const identifierName = this.stateManager.shiftFromStack().value as string;
    const valueToWrite = this.stateManager.getIdentifierValue(identifierName);
    console.log(`output: ${valueToWrite}`);
  };

  private handleJumpAnywayForward = () => {};

  private handleJumpAnywayBackward = () => {};

  private handleJumpIfFalse = () => {};

  private handleIndex = () => {};

  private commandsHandlers: Map<RPNCommands, CallableFunction> = new Map([
    [RPNCommands.index, this.handleIndex],
    [RPNCommands.jump_anyway_backward, this.handleJumpAnywayBackward],
    [RPNCommands.jump_anyway_forward, this.handleJumpAnywayForward],
    [RPNCommands.jump_if_false, this.handleJumpIfFalse],
    [RPNCommands.read, this.handleRead],
    [RPNCommands.write, this.handleWrite],
  ]);
}
