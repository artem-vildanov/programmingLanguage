import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import MoreIdentifiersParser from "./MoreIdentifiersParser";

export default class IdentifierDeclarationParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }
  
  private handleIdentifierDefinition = () => {
    const identifierToken = this.stateManager.getCurrentToken();
    this.stateManager.addToIdentifiersMap(identifierToken);
    this.stateManager.incrementTokenPointer();
    this.parseByParser(MoreIdentifiersParser);
  }

  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.identifier, this.handleIdentifierDefinition]
  ]);

}
