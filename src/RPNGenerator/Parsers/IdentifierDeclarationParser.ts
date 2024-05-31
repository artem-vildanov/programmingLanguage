import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import MoreIdentifiersParser from "./MoreIdentifiersParser";

export default class IdentifierDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  protected generationRules: GenerationRulesTuple = [
    [TokenType.identifier, this.handleIdentifierDefinition]
  ];

  private handleIdentifierDefinition(): GeneratorState {
    this.addCurrentTokenToIdentifiersMap();
    this.incrementTokenPointer();
    this.generatorState = this.getParser(MoreIdentifiersParser).parse();
    return this.generatorState;
  }
}
