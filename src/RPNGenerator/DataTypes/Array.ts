import DataType from "./DataType";
import Integer from "./Integer";

export default class Array extends DataType {
  value = [] as DataType[];
  type: string = "array";
  size: number = 0;
  constructor(name: string) {
    super(name);
  }

  initialize(): void {
    for (let i = 0; i < this.size; i++) {
      const cellName = `${this.name}_${i}`;
      const initialValue = new Integer(cellName);
      this.value.push(initialValue);
    }
  }
}
