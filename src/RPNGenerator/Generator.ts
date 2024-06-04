import IdentifierMapState from "./Enums/IdentifierMapState";
import Token from '../LexicalAnalyzer/Models/Token';
import { TokenType } from '../LexicalAnalyzer/Enums/TokenType';
import ProgramParser from "./Parsers/ProgramParser";
import GeneratorState from "./Models/GeneratorState";

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

  public generateRpn(): GeneratorState {
    const parser = new ProgramParser(this.generatorState);
    parser.parse();
    return this.generatorState;
  }
}