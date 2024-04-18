import State from "./State";
import Symbol from "../Symbol";
import { SymbolType } from "../Symbol";
import Lexer from "../Lexer";

export default class WordState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected changeState(analyzedSymbol: Symbol): State {
        // switch (analyzedSymbol.symbolType) {
        //     case SymbolType.letter:
        //         return new WordState();
        //         break;
        
        //     default:
        //         throw Error('unexpected symbol'); // TODO переделать
        //         break;
        // }
            
    }
}