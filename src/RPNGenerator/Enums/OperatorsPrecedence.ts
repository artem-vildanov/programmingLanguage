const OperatorsPrecedence: { [key: string]: number } = {
  '=': 0,
  '==': 1,
  '!=': 1,
  '<': 1,
  '>': 1,
  '<=': 1,
  '>=': 1,
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
};

export default OperatorsPrecedence;