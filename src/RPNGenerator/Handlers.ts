import { TokenType } from "../LexicalAnalyzer/Token"
import { GeneratorState } from "./Generator";
import Parser from "./Parser"
import ArrayDeclarationParser from "./Parsers/ArrayDeclarationParser";
import ExpressionParser from "./Parsers/ExpressionParser";
import IdentifierDeclarationParser from "./Parsers/IdentifierDeclarationParser";
import ProgramParser from "./Parsers/ProgramParser";
import SubscriptParser from "./Parsers/SubscriptParser";

export const handlers = {
  // P declarations or statements
  handleIntDefinition: function(this: Parser): GeneratorState {
    this.expectToken(TokenType.keyword_int);
    this.generatorState = new IdentifierDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  },

  handleFloatDefinition: function(this: Parser): GeneratorState {
    this.expectToken(TokenType.keyword_float);
    this.generatorState = new IdentifierDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  },

  handleArrayDefinition: function(this: Parser): GeneratorState {
    this.expectToken(TokenType.keyword_array);
    this.generatorState = new ArrayDeclarationParser(this.generatorState).parse();
    this.generatorState = new ProgramParser(this.generatorState).parse();
    return this.generatorState;
  },

  // P Q statements 
  handleAssignmentOperation: function(this: Parser): GeneratorState {
    this.expectToken(TokenType.identifier);
    this.generatorState = new SubscriptParser(this.generatorState).parse();
    this.expectToken(TokenType.logic_operator_assign);
    this.generatorState = new ExpressionParser(this.generatorState).parse();
    this.expectToken(TokenType.non_literal_semicolon);
    return this.generatorState;
  },

  handleReadOperation: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleWriteOperation: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleBlockIf: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleBlockElse: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleBlockWhile: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // I identifier declaration 
  handleIdentifierSequence: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // M more identifiers
  handleCommaIdentifierSequence: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // A array declaration 
  handleArraySequence: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // N more arrays
  handleCommaArraySequence: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // H subscript
  handleArraySubscript: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // C conditional
  handleParenConditional: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleIdentifierConditional: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleConstantConditional: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // D comparison
  handleLessComparison: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleMoreComparison: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleLessOrEqualComparison: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleEqualComparison: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleNotEqualComparison: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // E expression
  handleParenExpression: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleIdentifierExpression: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleConstantExpression: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // U expression tail
  handlePlusExpressionTail: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleMinusExpressionTail: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // T term
  handleParenTerm: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleIdentifierTerm: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleConstantTerm: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // V term tail
  handleMultiplicationTermTail: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleDivisionTermTail: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  // F factors
  handleExpressionFactor: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleIdentifierFactor: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

  handleConstantFactor: function(this: Parser): GeneratorState {

    return this.generatorState;
  },

}
