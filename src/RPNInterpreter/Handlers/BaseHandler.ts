import RPNItemTypes from "../../RPNGenerator/Enums/RPNItemTypes";
import RPNItem from "../../RPNGenerator/Models/RPNItem";
import CommandHandler from "./CommandHandler";
import InterpreterState from "../Models/InterpreterState";
import IHandler from "./IHandler";
import LabelHandler from "./LabelHandler";
import LabelPointerHandler from "./LabelPointerHandler";
import IdentifierHandler from "./IdentifierHandler";
import ConstantHandler from "./ConstantHandler";
import OperatorHandler from "./OperatorHandler";

export default class BaseHandler implements IHandler {
  constructor(private state: InterpreterState) {}

  async handle(rpnItem: RPNItem): Promise<void> {
    const HandlerClass = this.findHandlerByItem(rpnItem)
    await HandlerClass.handle(rpnItem);
  }

  private findHandlerByItem(rpnItem: RPNItem): IHandler {
    const constructor = this.itemsHandlers.get(rpnItem.itemType);
    
    if (constructor === undefined) {
      throw new Error(`handler not found, rpn item [ ${rpnItem} ]`);
    }

    return new constructor(this.state);
  }

  private handlers: [RPNItemTypes, new (state: InterpreterState) => IHandler][] = [
    [RPNItemTypes.command, CommandHandler],
    [RPNItemTypes.label, LabelHandler],
    [RPNItemTypes.label_pointer, LabelPointerHandler],
    [RPNItemTypes.identifier, IdentifierHandler],
    [RPNItemTypes.constant, ConstantHandler],
    [RPNItemTypes.operator, OperatorHandler]
  ];
  
  private itemsHandlers = new Map<RPNItemTypes, new (state: InterpreterState) => IHandler>(this.handlers);
}
