import ArrayDeclarationParser from "./ArrayDeclarationParser";
import IdentifierMapState from "../Enums/IdentifierMapState";
import IdentifierDeclarationParser from "./IdentifierDeclarationParser";
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import GeneratorState from "../Models/GeneratorState";
import Parser from "./Parser";
import StatementParser from "./StatementParser";

export default class ProgramParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleIntegerDeclaration = () => {
      this.stateManager.expectToken(TokenType.keyword_int);
      this.stateManager.setIdentifierMapState(IdentifierMapState.write_integer);
      this.parseByParser(IdentifierDeclarationParser);
      this.parseByParser(ProgramParser);
  }

  private handleFloatDeclaration = () => {
    this.stateManager.expectToken(TokenType.keyword_float);
    this.stateManager.setIdentifierMapState(IdentifierMapState.write_float);
    this.parseByParser(IdentifierDeclarationParser);
    this.parseByParser(ProgramParser);
  }

  private handleArrayDeclaration = () => {
    this.stateManager.expectToken(TokenType.keyword_array);
    this.stateManager.setIdentifierMapState(IdentifierMapState.write_array);
    this.parseByParser(ArrayDeclarationParser);
    this.parseByParser(ProgramParser);
  }

  private handleStatementsBlock = () => {
    this.stateManager.expectToken(TokenType.keyword_begin);
    this.parseByParser(StatementParser);
    this.stateManager.expectToken(TokenType.keyword_end);
  }


  protected generationRules = new Map<TokenType, CallableFunction>([
    [TokenType.keyword_int, this.handleIntegerDeclaration],
    [TokenType.keyword_float, this.handleFloatDeclaration],
    [TokenType.keyword_array, this.handleArrayDeclaration],
    [TokenType.keyword_begin, this.handleStatementsBlock]
  ]);

}
