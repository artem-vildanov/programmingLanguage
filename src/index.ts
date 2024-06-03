import Lexer from "./LexicalAnalyzer/Lexer";
import Generator from "./RPNGenerator/Generator";

const code =
`  
int a, k;
int c;
float b, i;
array collection[10];

begin
    while (a > b + 2 * (10 - 2 + a)) {
        a = b;
    }
end
`

const lexer = new Lexer(code);
const tokens = lexer.lexicalAnalysis();

const generator = new Generator(tokens);
const reversePolishNotation = generator.generateRPN();
console.log(reversePolishNotation.identifierMap);
let rpnString = '' 
reversePolishNotation.generatedRPN.forEach(item => {
    rpnString = rpnString + item.value + ' ';
}) 
console.log(rpnString);

