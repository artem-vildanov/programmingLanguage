import RPNItem from "../../RPNGenerator/Models/RPNItem";
import InterpreterState from "../Models/InterpreterState";
import IHandler from "./IHandler";

export default class LabelPointerHandler implements IHandler {
  constructor(private state: InterpreterState) {}

  handle(rpnItem: RPNItem): void {}
}