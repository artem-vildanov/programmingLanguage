import Lexer from "./Lexer";

const code = 
`   
    int a = 10;
    float b = 12;
    while(a != b) {
        a = 123 / 2;
        if(a <= baw) {
            
        }
    }
`;
const lexer = new Lexer(code);
const tokens = lexer.lexicalAnalysis();
console.log(tokens);