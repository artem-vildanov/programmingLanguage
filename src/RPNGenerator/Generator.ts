import Token, { TokenType } from "../LexicalAnalyzer/Token";
import Array from "./DataTypes/Array";
import DataType from "./DataTypes/DataType";
import Float from "./DataTypes/Float";
import Integer from "./DataTypes/Integer";
import ProgramParser from "./Parsers/ProgramParser";

export enum IdentifierMapState {
  write_integer = 'write_integer',
  write_float = 'write_float',
  write_array = 'write_array',
  not_stated = 'not_stated'
}

export type GeneratorState = {
  labelCount: number,
  tokenPointer: number,
  tokens: Token[],
  generatedRPN: string[]

  identifierMapState: IdentifierMapState,
  identifierMap: DataType[]
}

export default class Generator {

  private generatorState: GeneratorState;

  constructor(tokens: Token[]) {
    this.generatorState = {
      labelCount: 0,
      tokenPointer: 0,
      tokens: tokens,
      generatedRPN: [],
      identifierMapState: IdentifierMapState.not_stated,
      identifierMap: []
    }
  }

  public generateRPN(): string[] {
    const parser = new ProgramParser(this.generatorState);
    parser.parse();

    return this.generatorState.generatedRPN;
  }
}


export const generator = new Generator([]);

