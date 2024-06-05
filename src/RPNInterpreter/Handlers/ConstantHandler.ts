import RPNItem from "../../RPNGenerator/Models/RPNItem";
import InterpreterStateManager from "../Managers/InterpreterStateManager";
import InterpreterState from "../Models/InterpreterState";
import IHandler from "./IHandler";

export default class ConstantHandler implements IHandler {
  private stateManager: InterpreterStateManager;
  constructor(state: InterpreterState) {
    this.stateManager = new InterpreterStateManager(state);
  }

  handle(rpnItem: RPNItem): void {
    this.stateManager.unshiftIntoStack(rpnItem.value as number);
  }
}
