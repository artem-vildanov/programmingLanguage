import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import MoreIdentifiersParser from "./MoreIdentifiersParser";

export default class IdentifierDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleIdentifierDefinition = () => {
    this.addCurrentTokenToIdentifiersMap();
    this.incrementTokenPointer();
    this.parseByParser(MoreIdentifiersParser);
    return this.generatorState;
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.identifier, this.handleIdentifierDefinition]
  ];

}
