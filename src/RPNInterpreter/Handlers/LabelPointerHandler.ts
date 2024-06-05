import RPNItem from "../../RPNGenerator/Models/RPNItem";
import JumpStates from "../Enums/JumpStates";
import InterpreterStateManager from "../Managers/InterpreterStateManager";
import InterpreterState from "../Models/InterpreterState";
import IHandler from "./IHandler";

export default class LabelPointerHandler implements IHandler {
  private stateManager: InterpreterStateManager;
  constructor(state: InterpreterState) {
    this.stateManager = new InterpreterStateManager(state);
  }

  handle(rpnItem: RPNItem): void {
    this.stateManager.clearJumpTarget();
    this.stateManager.setJumpState(JumpStates.not_jumping);
  }
}