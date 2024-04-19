import Lexer from "../Lexer";
import FloatNumberState from "./FloatNumberState";
import InitialState from "./InitialState";
import NotEqualState from "./NotEqualState";
import NumberState from "./NumberState";
import OperationState from "./OperationState";
import WordState from "./WordState";
import State from "./State";

export default class StateFactory {
    static getFloatNumberState(context: Lexer): State {
        return new FloatNumberState(context);
    }

    static getInitialState(context: Lexer): State {
        return new InitialState(context);
    }

    static getNotEqualState(context: Lexer): State {
        return new NotEqualState(context);
    }

    static getNumberState(context: Lexer): State {
        return new NumberState(context);
    }

    static getOperationState(context: Lexer): State {
        return new OperationState(context);
    }

    static getWordState(context: Lexer): State {
        return new WordState(context);
    }
}