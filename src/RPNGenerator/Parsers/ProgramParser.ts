import { handlers } from "../Handlers";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser"

export default class ProgramParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  public parse(): GeneratorState {
    return this.generatorState;
  }

  private rules: GenerationRulesTuple = [
    [TokenType.keyword_int, handlers.handleIntDefinition.bind(this)],
    [TokenType.keyword_float, handlers.handleFloatDefinition.bind(this)],
  ]
}
