import RPNItem from "../RPNGenerator/Models/RPNItem";
import DataType from "../RPNGenerator/DataTypes/DataType";
import InterpreterState from "./Models/InterpreterState";
import BaseHandler from "./Handlers/BaseHandler";
import GeneratorState from "../RPNGenerator/Models/GeneratorState";
import JumpStates from "./Enums/JumpStates";

export default class Interpreter {
  private state: InterpreterState;
  private handler: BaseHandler;
  constructor(generatorState: GeneratorState) {
    this.state = {
      rpnSequence: generatorState.generatedRPN,
      identifiersMap: generatorState.identifierMap,
      interpreterStack: [],
      sequencePointer: 0,
      jumpTarget: null,
      jumpState: JumpStates.not_jumping
    };

    this.handler = new BaseHandler(this.state);
  }

  async interpretateRpn(): Promise<void> {
    while (await this.nextItem());
  }

  private async nextItem(): Promise<boolean> {
    const pointer = this.state.sequencePointer;
    const sequence = this.state.rpnSequence;

    if (pointer >= sequence.length) {
      return false;
    }

    const currentItem = { ...sequence[pointer] };

    /** пропускаем элементы ОПС если перепрыгиваем на метку */
    if (
      this.state.jumpState === JumpStates.jump_forward &&
      this.state.jumpTarget !== currentItem.value
    ) {
      this.incrementPointer();
      return true;
    }

    if (
      this.state.jumpState === JumpStates.jump_backward &&
      this.state.jumpTarget !== currentItem.value
    ) {
      this.decrementPointer();
      return true;
    }

    await this.handler.handle(currentItem);
    this.incrementPointer();
    return true;
  }

  private incrementPointer(): void {
    this.state.sequencePointer++;
  }

  private decrementPointer(): void {
    this.state.sequencePointer--;
  }
}
