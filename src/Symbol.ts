export enum SymbolType {
    number = '[0-9]', // regex expression of read symbol
    letter = '[a-zA-Z]',
    mathOperation = '[+\\-*/]', // Escaping is not required for most math operators
    equalTo = '[=]',
    moreOrLessThan = '[<>]',
    notEqualTo = '[!]',
    openRoundBracket = '[(]',
    closeRoundBracket = '[)]',
    openSquareBracket = '[\[]',
    closeSquareBracket = '[\]]',
    openOrCloseFigureBracket = '[}{]',
    dot = '[.]',
    comma = '[,]',
    endOfLine = '[;]',
    space = '\\s', // Corrected for whitespace
    newLine = '\\n', // Corrected for newline
}

export default class Symbol {
    constructor(
        public symbol: string, 
        public symbolType: SymbolType
    ) {}
}