import Lexer from "./LexicalAnalyzer/Lexer";
import Generator from "./RPNGenerator/Generator";
import Interpreter from "./RPNInterpreter/Interpreter";

const code = 
`  
int a, b;
int true, false;

begin
  true = 1;
  false = 0;

  read(a);
  read(b);

  if (a > b) {
    write(true);
  } else {
    write(false);
  }
end
`;

const lexer = new Lexer(code);
const tokens = lexer.lexicalAnalysis();

const generator = new Generator(tokens);
const generatorState = generator.generateRpn();

/**
const rpnString = generatorState.generatedRPN
  .map((item) => item.value)
  .join(" ");

console.log(rpnString);
*/

const interpreter = new Interpreter(generatorState);
interpreter.interpretateRpn();


