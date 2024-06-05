import DataType from "../../RPNGenerator/DataTypes/DataType";
import RPNItem from "../../RPNGenerator/Models/RPNItem";

export default class TypesIncompatible implements Error {
  message: string;
  name = "TypesIncompatible";
  constructor(identifier: DataType, valueToAssign: number) {
    this.message = `unable to assign [ ${valueToAssign} ] to [ ${identifier.name} ]: types incompatible`;
  }
}
