import DataType from "../../RPNGenerator/DataTypes/DataType"
import RPNItem from "../../RPNGenerator/Models/RPNItem"

type InterpreterState = {
    rpnSequence: RPNItem[],
    sequencePointer: number,
    identifiersMap: DataType[],
    /** 
     * Для выполнения математических 
     * операций и управления 
     * потоком исполнения 
     */
    interpreterStack: RPNItem[],
}

export default InterpreterState;