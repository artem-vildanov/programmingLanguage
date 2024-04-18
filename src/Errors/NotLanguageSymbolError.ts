export default class NotLanguageSymbolError implements Error {
    name: string;
    message: string;
    constructor(private errorSymbol: string) {
        this.name = 'NotLanguageSymbolError';
        this.message = `not language symbol ${errorSymbol}`;
    }
}