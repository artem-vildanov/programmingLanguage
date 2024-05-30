import { GeneratorState } from "../Generator";
import Parser from "../Parser";

export default class IdentifierDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  public parse(): GeneratorState {

    return this.generatorState;
  }
}
