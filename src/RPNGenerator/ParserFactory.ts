import { TokenType } from "../../LexicalAnalyzer/Token";
import { GeneratorState } from "../Generator";
import IdentifierListParser from "./IdentifierListParser";
import Parser from "./Parser";

export default class ParserFactory {
  static getIdentifierListParser(generatorState: GeneratorState): any {
    return new IdentifierListParser(generatorState);
  }
}

// export const handleInt = function(this: Parser): GeneratorState {
//   this.expectToken(TokenType.keyword); // expect int
//   
// }
//
// export const handleIf = function(this: Parser): GeneratorState {
//     
// }
//
// export const handleElse = function(this: Parser): GeneratorState {
//
// }
