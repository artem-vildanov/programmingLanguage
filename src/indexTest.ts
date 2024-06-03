// enum TokenType {
//   IF = "IF",
//   ELSE = "ELSE",
//   IDENTIFIER = "IDENTIFIER",
//   NUMBER = "NUMBER",
//   OPERATOR = "OPERATOR",
//   ASSIGN = "ASSIGN",
//   LEFT_PAREN = "LEFT_PAREN",
//   RIGHT_PAREN = "RIGHT_PAREN",
//   LEFT_BRACE = "LEFT_BRACE",
//   RIGHT_BRACE = "RIGHT_BRACE",
//   SEMICOLON = "SEMICOLON",
// }

// interface Token {
//   type: TokenType;
//   value: string;
// }

// function lexer(input: string): Token[] {
//   const tokens: Token[] = [];
//   const tokenPatterns: [RegExp, TokenType | null][] = [
//     [/^\s+/, null],
//     [/^if/, TokenType.IF],
//     [/^else/, TokenType.ELSE],
//     [/^[a-zA-Z_]\w*/, TokenType.IDENTIFIER],
//     [/^\d+/, TokenType.NUMBER],
//     [/^[+\-*/<>!=]=?|&&|\|\|/, TokenType.OPERATOR],
//     [/^=/, TokenType.ASSIGN],
//     [/^\(/, TokenType.LEFT_PAREN],
//     [/^\)/, TokenType.RIGHT_PAREN],
//     [/^\{/, TokenType.LEFT_BRACE],
//     [/^\}/, TokenType.RIGHT_BRACE],
//     [/^;/, TokenType.SEMICOLON],
//   ];

//   let pos = 0;
//   while (pos < input.length) {
//     const remainingInput = input.slice(pos);
//     let match = null;

//     for (const [pattern, type] of tokenPatterns) {
//       match = pattern.exec(remainingInput);
//       if (match) {
//         if (type) {
//           tokens.push({ type, value: match[0] });
//         }
//         pos += match[0].length;
//         break;
//       }
//     }

//     if (!match) {
//       throw new Error(`Unexpected token: ${remainingInput[0]}`);
//     }
//   }

//   return tokens;
// }

// function parseAndGenerateRPN(tokens: Token[]): string[] {
//   const output: string[] = [];
//   const labels: string[] = [];
//   let labelCount = 0;
//   let current = 0;

//   function newLabel(): string {
//     return `L${labelCount++}`;
//   }

//   function expect(type: TokenType): Token {
//     const token = tokens[current];
//     if (token.type !== type) {
//       throw new Error(`Expected ${type} but got ${token.type}`);
//     }
//     current++;
//     return token;
//   }

//   function parseExpression() {
//     const token = tokens[current];
//     if (token.type === TokenType.IDENTIFIER || token.type === TokenType.NUMBER) {
//       output.push(token.value);
//       current++;
//     } else if (token.type === TokenType.LEFT_PAREN) {
//       current++;
//       parseExpression();
//       expect(TokenType.RIGHT_PAREN);
//     }
//     while (tokens[current] && tokens[current].type === TokenType.OPERATOR) {
//       const operator = tokens[current];
//       current++;
//       parseExpression();
//       output.push(operator.value);
//     }
//   }

//   function parseStatement() {
//     const token = tokens[current];
//     if (token.type === TokenType.IF) {
//       current++;
//       expect(TokenType.LEFT_PAREN);
//       parseExpression();
//       expect(TokenType.RIGHT_PAREN);
//       const elseLabel = newLabel();
//       const endLabel = newLabel();
//       output.push(elseLabel);
//       output.push("jf");
//       expect(TokenType.LEFT_BRACE);
//       while (tokens[current] && tokens[current].type !== TokenType.RIGHT_BRACE) {
//         parseStatement();
//       }
//       expect(TokenType.RIGHT_BRACE);
//       output.push(endLabel);
//       output.push("j");
//       output.push(`${elseLabel}:`);
//       if (tokens[current] && tokens[current].type === TokenType.ELSE) {
//         current++;
//         expect(TokenType.LEFT_BRACE);
//         while (tokens[current] && tokens[current].type !== TokenType.RIGHT_BRACE) {
//           parseStatement();
//         }
//         expect(TokenType.RIGHT_BRACE);
//       }
//       output.push(`${endLabel}:`);
//     } else if (token.type === TokenType.IDENTIFIER) {
//       const identifier = token.value;
//       current++;
//       expect(TokenType.OPERATOR);
//       parseExpression();
//       output.push(identifier);
//       output.push(":=");
//       expect(TokenType.SEMICOLON);
//     } else {
//       throw new Error(`Unexpected token: ${token.type}`);
//     }
//   }

//   while (current < tokens.length) {
//     parseStatement();
//   }

//   return output;
// }

// function convertToRPN(input: string): string[] {
//   const tokens = lexer(input);
//   return parseAndGenerateRPN(tokens);
// }

// const inputCode = "if (a > b) { if ( c == w ) { q = c; ew = 21; } } else { b = a; }";
// const rpnOutput = convertToRPN(inputCode);
// console.log(rpnOutput.join(' ')); // Output: a b > L0 jf a b := L1 j L0: b a := L1:
function infixToPostfix(expression: string): string {
  const precedence: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
  };

  const isOperator = (c: string) => /[+\-*/]/.test(c);
  const isDigit = (c: string) => /\d/.test(c);

  let output: string[] = [];
  let operators: string[] = [];

  for (let i = 0; i < expression.length; i++) {
      const token = expression[i];

      if (isDigit(token)) {
          let num = token;
          while (i + 1 < expression.length && isDigit(expression[i + 1])) {
              num += expression[++i];
          }
          output.push(num);
      } else if (token === '(') {
          operators.push(token);
      } else if (token === ')') {
          while (operators.length && operators[operators.length - 1] !== '(') {
              output.push(operators.pop()!);
          }
          operators.pop(); // Remove '(' from stack
      } else if (isOperator(token)) {
          while (
              operators.length &&
              precedence[operators[operators.length - 1]] >= precedence[token]
          ) {
              output.push(operators.pop()!);
          }
          operators.push(token);
      }
  }

  while (operators.length) {
      output.push(operators.pop()!);
  }

  return output.join(' ');
}

// Пример использования
const expression = "10 + 5 - 3 - 9 * 2";
console.log(infixToPostfix(expression)); 
