import Token, { TokenType } from "../LexicalAnalyzer/Token";
import { GeneratorState } from "./Generator";

export type GenerationRulesTuple = [TokenType, CallableFunction][];

export default abstract class Parser {
  constructor(protected generatorState: GeneratorState) { }

  public abstract parse(): GeneratorState;

  protected incrementLabelCount(): number {
    return this.generatorState.labelCount++;
  }

  protected getNewLabel(): string {
    return `L${this.incrementLabelCount()}`;
  }

  protected expectToken(expectedTokenType: TokenType): void {
    const current = this.getCurrentToken().type;
    const expected = expectedTokenType as string;
    if (current !== expected) {
      throw new Error(`Expected ${expected} but got ${current}`);
    }

    this.incrementLabelCount();
  }

  protected getCurrentToken(): Token {
    return this.generatorState.tokens[this.generatorState.tokenPointer];
  }
}

