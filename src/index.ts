import Lexer from "./Lexer";

const code = `
    int a = 10;
    float b = 12;
    while
`;
const lexer = new Lexer(code);
lexer.lexicalAnalysis();