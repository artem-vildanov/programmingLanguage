import DataType from "./DataType";

export default class Boolean extends DataType {
  type: string = "boolean";
  value: boolean = true;
  constructor(name: string) {
    super(name);
  }
}
