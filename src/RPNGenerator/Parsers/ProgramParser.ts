import ArrayDeclarationParser from "./ArrayDeclarationParser";
import { IdentifierMapState } from "../Generator";
import IdentifierDeclarationParser from "./IdentifierDeclarationParser";
import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import Parser, { GenerationRulesTuple } from "../Parser"
import StatementParser from "./StatementParser";

export default class ProgramParser extends Parser {
  constructor(generatorState: GeneratorState) {
    super(generatorState);
  }

  protected generationRules: GenerationRulesTuple = [
    [TokenType.keyword_int, this.handleIntegerDeclaration],
    [TokenType.keyword_float, this.handleFloatDeclaration],
    [TokenType.keyword_array, this.handleArrayDeclaration],
    [TokenType.keyword_begin, this.handleStatementsBlock]
  ];

  private handleIntegerDeclaration(): GeneratorState {
    this.expectToken(TokenType.keyword_int);
    this.generatorState.identifierMapState = IdentifierMapState.write_integer; // состояние считывания integer переменных
    this.generatorState = new IdentifierDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  }

  private handleFloatDeclaration(): GeneratorState {
    this.expectToken(TokenType.keyword_float);
    this.generatorState.identifierMapState = IdentifierMapState.write_float;
    this.generatorState = new IdentifierDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  }

  private handleArrayDeclaration(): GeneratorState {
    this.expectToken(TokenType.keyword_array);
    this.generatorState.identifierMapState = IdentifierMapState.write_array;
    this.generatorState = new ArrayDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  }

  private handleStatementsBlock(): GeneratorState {
    this.expectToken(TokenType.keyword_begin);
    this.generatorState = new StatementParser(this.generatorState).parse();
    this.expectToken(TokenType.keyword_end);
    return this.generatorState;
  }
}
