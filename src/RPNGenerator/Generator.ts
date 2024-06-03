import Token, { TokenType } from "../LexicalAnalyzer/Token";
import DataType from "./DataTypes/DataType";
import ProgramParser from "./Parsers/ProgramParser";

export type RPNItem = {
  itemType: RPNItemTypes,
  value: string | number,
  token: null | Token
}

export const OperatorsPrecedence: { [key: string]: number } = {
  '=': 0,
  '==': 1,
  '!=': 1,
  '<': 1,
  '>': 1,
  '<=': 1,
  '>=': 1,
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
};

export enum RPNItemTypes {
  command = 'command',
  label = 'label',
  label_pointer = 'label_pointer',
  identifier = 'identifier',
  constant = 'constant',
  operator = 'operator'
}

export enum RPNCommands {
  jump_if_false = 'jump_if_false',
  jump_anyway_forward = 'jump_anyway_forward',
  jump_anyway_backward = 'jump_anyway_backward', 
  read = 'read',
  write = 'write',
  index = 'index'
}

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
  generatedRPN: RPNItem[],

  identifierMapState: IdentifierMapState,
  identifierMap: DataType[],

  operatorsStack: Token[]
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
      identifierMap: [],
      operatorsStack: []
    }
  }

  public generateRPN(): GeneratorState {
    const parser = new ProgramParser(this.generatorState);
    this.generatorState = parser.parse();

    return this.generatorState;
  }
}