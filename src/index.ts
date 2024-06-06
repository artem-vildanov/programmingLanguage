import Lexer from "./LexicalAnalyzer/Lexer";
import Generator from "./RPNGenerator/Generator";
import RPNItem from "./RPNGenerator/Models/RPNItem";
import Interpreter from "./RPNInterpreter/Interpreter";

function writeRpnString(rpnSequence: RPNItem[]): void {
  const rpnString = rpnSequence
    .map((item) => item.value)
    .join(" ");

  console.log(rpnString);
}

const code = 
`  
int first, 
  second, 
  arraySize, 
  index, 
  innerIndex, 
  firstSwapValue,
  secondSwapValue;

array collection[5];

begin
  arraySize = 5;

  index = 0;

  while (index < arraySize) {
    read(collection[index]);
    index = index + 1;
  }

  index = 0;

  while (index < arraySize) {
    innerIndex = 0;
    while (innerIndex < arraySize - index - 1) {
      if (collection[innerIndex] > collection[innerIndex + 1]) {
        firstSwapValue = collection[innerIndex + 1];
        secondSwapValue = collection[innerIndex];
        collection[innerIndex + 1] = secondSwapValue;
        collection[innerIndex] = firstSwapValue;
      }

      innerIndex = innerIndex + 1;
    }

    index = index + 1;
  }

  index = 0;

  while (index < arraySize) {
    write(collection[index]);
    index = index + 1;
  }

end
`;

const lexer = new Lexer(code);
const tokens = lexer.lexicalAnalysis();

const generator = new Generator(tokens);
const generatorState = generator.generateRpn();

// writeRpnString(generatorState.generatedRPN);

const interpreter = new Interpreter(generatorState);
interpreter.interpretateRpn();


