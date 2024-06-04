import Token from '../../LexicalAnalyzer/Models/Token';
import DataType from "../DataTypes/DataType";
import IdentifierMapState from "../Enums/IdentifierMapState";
import RPNItem from "./RPNItem";

type GeneratorState = {
  labelCount: number;
  tokenPointer: number;
  tokens: Token[];
  generatedRPN: RPNItem[];
  identifierMapState: IdentifierMapState;
  identifierMap: DataType[];
  operatorsStack: Token[];
};

export default GeneratorState;