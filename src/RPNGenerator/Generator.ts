import Token, { TokenType } from "../LexicalAnalyzer/Token";
import ProgramParser from "./Parsers/ProgramParser";

export type GeneratorState = {
  labelCount: number,
  tokenPointer: number,
  tokens: Token[],
  generatedRPN: string[]
}

export default class Generator {

  private generatorState: GeneratorState;

  constructor(tokens: Token[]) {
    this.generatorState = {
      labelCount: 0,
      tokenPointer: 0,
      tokens: tokens,
      generatedRPN: []
    }
  }


  public generateRPN(): string[] {
    const parser = new ProgramParser(this.generatorState);
    parser.parse();

    return this.generatorState.generatedRPN;
  }
}


export const generator = new Generator([]);

