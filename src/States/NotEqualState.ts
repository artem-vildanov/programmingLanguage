import Symbol, { SymbolType } from '../Symbol';
import State from './State'
import WordState from './WordState';
import { TransitionRulesTuple } from './State';
import Lexer from '../Lexer';

export default class NotEqualState extends State {
    constructor(context: Lexer) {
        super(context);
    }

    protected transitionRules: TransitionRulesTuple = [
        
    ];

    protected changeState(analyzedSymbol: Symbol): State {
        
    }
}