import RPNItem from "../RPNGenerator/Models/RPNItem";
import DataType from "../RPNGenerator/DataTypes/DataType";
import InterpreterState from "./Models/InterpreterState";
import BaseHandler from "./Handlers/BaseHandler";

export default class Interpreter {
  private state: InterpreterState;
  private handler: BaseHandler;
  constructor(rpnSequence: RPNItem[], identifiersMap: DataType[]) {
    this.state = {
      rpnSequence: rpnSequence,
      identifiersMap: identifiersMap,
      interpreterStack: [],
      sequencePointer: 0,
    }

    this.handler = new BaseHandler(this.state);
  }

  async interpretateRpn(): Promise<InterpreterState> {
    while(await this.nextItem());
    return this.state;
  }

  private async nextItem(): Promise<boolean> {
    const pointer = this.state.sequencePointer;
    const sequence = this.state.rpnSequence;

    if (pointer >= sequence.length) {
      return false;
    }

    const currentItem = sequence[pointer];
    await this.handler.handle(currentItem);
    this.incrementPointer();
    return true;
  }

  private incrementPointer(): void {
    this.state.sequencePointer++;
  }
}
