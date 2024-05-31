import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";

export default class StatementParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  protected generationRules: GenerationRulesTuple = [
    [TokenType.identifier, this.handleAssignment],
    [TokenType.keyword_read, this.handleRead],
    [TokenType.keyword_write, this.handleWrite],
    [TokenType.keyword_if, this.handleIf],
    [TokenType.keyword_while, this.handleWhile],
    [TokenType.default, this.handleLambda] // обработать вариант lambda правила
  ];

  private handleAssignment(): GeneratorState {
    return this.generatorState;
  }

  private handleRead(): GeneratorState {
    return this.generatorState;
  }

  private handleWrite(): GeneratorState {
    return this.generatorState;
  }

  private handleIf(): GeneratorState {

    return this.generatorState;
  }

  private handleWhile(): GeneratorState {

    return this.generatorState;
  }

  private handleLambda(): GeneratorState {

    return this.generatorState;
  }
}
