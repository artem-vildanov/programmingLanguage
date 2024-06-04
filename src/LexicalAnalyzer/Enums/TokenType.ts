
export enum TokenType {
    /**
     * lambda rule
     */
    default = 'default',

    identifier = 'identifier',
    number_integer = 'number_integer',
    number_float = 'number_float',

    keyword_if = 'if',
    keyword_else = 'else',
    keyword_while = 'while',
    keyword_read = 'read',
    keyword_write = 'write',
    keyword_int = 'int',
    keyword_float = 'float',
    keyword_array = 'array',
    keyword_begin = 'begin',
    keyword_end = 'end',

    math_operator_plus = '+',
    math_operator_minus = '-',
    math_operator_multiply = '*',
    math_operator_divide = '/',

    logic_operator_assign = '=',
    logic_operator_equality = '==',
    logic_operator_unequality = '!=',
    logic_operator_more_or_equal = '>=',
    logic_operator_less_or_equal = '<=',
    logic_operator_less = '<',
    logic_operator_more = '>',

    non_literal_comma = ',',
    non_literal_open_paren = '(',
    non_literal_close_paren = ')',
    non_literal_open_bracket = '[',
    non_literal_close_bracket = ']',
    non_literal_open_brace = '{',
    non_literal_close_brace = '}',
    non_literal_semicolon = ';'

}
