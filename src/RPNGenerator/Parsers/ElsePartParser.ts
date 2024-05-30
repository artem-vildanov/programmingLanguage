import { GeneratorState } from "../Generator";
import Parser from "../Parser";

export default class ElsePartParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  public parse(): GeneratorState {

    return this.generatorState;
  }
}
