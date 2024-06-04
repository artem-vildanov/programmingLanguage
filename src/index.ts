import Lexer from "./LexicalAnalyzer/Lexer";
import Generator from "./RPNGenerator/Generator";
import Interpreter from "./RPNInterpreter/Interpreter";

const code = `  
int a, k;
int c;
float b, i;
array collection[10];

begin
  read(a);
  write(a);
end
`;

const lexer = new Lexer(code);
const tokens = lexer.lexicalAnalysis();

const generator = new Generator(tokens);
const reversePolishNotation = generator.generateRpn();

/**
const rpnString = reversePolishNotation.generatedRPN
  .map((item) => item.value)
  .join(" ");

console.log(rpnString);
*/

const interpreter = new Interpreter(
  reversePolishNotation.generatedRPN, 
  reversePolishNotation.identifierMap
);

const result = interpreter.interpretateRpn();


