import ArrayDeclarationParser from "./ArrayDeclarationParser";
import { IdentifierMapState } from "../Generator";
import IdentifierDeclarationParser from "./IdentifierDeclarationParser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser"
import StatementParser from "./StatementParser";
import Array from "../DataTypes/Array";

export default class ProgramParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  private handleIntegerDeclaration = () => {
      this.expectToken(TokenType.keyword_int);
      this.generatorState.identifierMapState = IdentifierMapState.write_integer; // состояние считывания integer переменных
      this.parseByParser(IdentifierDeclarationParser);
      this.parseByParser(ProgramParser);
      return this.generatorState;
  }

  private handleFloatDeclaration = () => {
    this.expectToken(TokenType.keyword_float);
    this.generatorState.identifierMapState = IdentifierMapState.write_float;
    this.parseByParser(IdentifierDeclarationParser);
    this.parseByParser(ProgramParser);
    return this.generatorState;
  }

  private handleArrayDeclaration = () => {
    this.expectToken(TokenType.keyword_array);
    this.generatorState.identifierMapState = IdentifierMapState.write_array;
    this.parseByParser(ArrayDeclarationParser);
    this.parseByParser(ProgramParser);
    return this.generatorState;
  }

  private handleStatementsBlock = () => {
    this.expectToken(TokenType.keyword_begin);
    this.parseByParser(StatementParser);
    this.expectToken(TokenType.keyword_end);
    return this.generatorState;
  }


  protected generationRules: GenerationRulesTuple = [
    [TokenType.keyword_int, this.handleIntegerDeclaration],
    [TokenType.keyword_float, this.handleFloatDeclaration],
    [TokenType.keyword_array, this.handleArrayDeclaration],
    [TokenType.keyword_begin, this.handleStatementsBlock]
  ];

}
