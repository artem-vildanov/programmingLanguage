export enum SymbolType {
    number = '[0-9]',
    letter = '[a-zA-Z]',
    mathOperation = '[+\\-*/]',
    equalTo = '[=]',
    moreOrLessThan = '[<>]',
    notEqualTo = '[!]',
    openRoundBracket = '[(]',
    closeRoundBracket = '[)]',
    openSquareBracket = '[\\[]',
    closeSquareBracket = '[\\]]',
    openOrCloseFigureBracket = '[}{]',
    dot = '[.]',
    comma = '[,]',
    endOfLine = '[;]',
    space = "\\s",
    newLine = "\\n"
}
