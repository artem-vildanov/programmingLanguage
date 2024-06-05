import DataType from "../../RPNGenerator/DataTypes/DataType"
import RPNItem from "../../RPNGenerator/Models/RPNItem"
import JumpStates from "../Enums/JumpStates";

type InterpreterState = {
    rpnSequence: RPNItem[],
    sequencePointer: number,
    identifiersMap: DataType[],
    /** 
     * Для выполнения математических 
     * операций и управления 
     * потоком исполнения.
     * DataType - для переменных,
     * nubmer - для констант
     */
    interpreterStack: Array<DataType | number | boolean>,

    jumpTarget: null | string,
    jumpState: JumpStates
}

export default InterpreterState;